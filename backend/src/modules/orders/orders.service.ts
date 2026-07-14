// src/modules/orders/orders.service.ts
import { prisma } from '../../config/database'
import { AppError, NotFoundError, ForbiddenError } from '../../shared/errors/AppError'
import { sendEmail, orderConfirmationEmail } from '../../shared/utils/email'
import { getPagination, buildPaginatedResponse } from '../../shared/utils/pagination'
import type { Request } from 'express'
import type { CreateOrderDto, UpdateOrderStatusDto } from './orders.schema'
import type { PrismaClient } from '@prisma/client'

type TxClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export class OrdersService {
  async create(userId: string, data: CreateOrderDto) {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
        variant: true,
        customization: true,
      },
    })

    if (cartItems.length === 0) throw new AppError('Carrinho vazio', 400, 'EMPTY_CART')

    const address = await prisma.address.findFirst({ where: { id: data.addressId, userId } })
    if (!address) throw new NotFoundError('Endereço')

    for (const item of cartItems as typeof cartItems) {
      if (!item.product.available)
        throw new AppError(`Produto "${item.product.name}" não disponível`, 400, 'PRODUCT_UNAVAILABLE')
      if (!item.variant.available)
        throw new AppError(`Variante de "${item.product.name}" não disponível`, 400, 'VARIANT_UNAVAILABLE')
      if (item.variant.stock < item.quantity)
        throw new AppError(
          `Estoque insuficiente para "${item.product.name}". Disponível: ${item.variant.stock}`,
          400,
          'INSUFFICIENT_STOCK',
        )
    }

    const orderItemsData = (cartItems as typeof cartItems).map((item: (typeof cartItems)[number]) => {
      const printOption = item.customization?.printOption ?? 'fronteVerso'
      let unitPrice: number
      if (printOption === 'frente') unitPrice = Number(item.product.priceFront)
      else if (printOption === 'verso') unitPrice = Number(item.product.priceBack)
      else unitPrice = Number(item.product.priceBoth)

      return {
        productId: item.productId,
        variantId: item.variantId,
        customizationId: item.customizationId,
        quantity: item.quantity,
        unitPrice,
        subtotal: unitPrice * item.quantity,
        productName: item.product.name,
        productImage: item.product.images[0]?.url ?? null,
        color: item.variant.color,
        size: item.variant.size,
      }
    })

    const subtotal = orderItemsData.reduce((sum: number, item: { subtotal: number }) => sum + item.subtotal, 0)

    let discount = 0
    let couponId: string | undefined

    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } })
      if (!coupon || !coupon.isActive) throw new AppError('Cupom inválido', 400, 'INVALID_COUPON')
      if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new AppError('Cupom expirado', 400, 'EXPIRED_COUPON')
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new AppError('Cupom esgotado', 400, 'COUPON_EXHAUSTED')
      discount = coupon.type === 'percent' ? subtotal * (Number(coupon.value) / 100) : Number(coupon.value)
      discount = Math.min(discount, subtotal)
      couponId = coupon.id
    }

    const shippingCost = subtotal - discount >= 299 ? 0 : 20
    const total = subtotal - discount + shippingCost

    const order = await prisma.$transaction(async (tx: TxClient) => {
      const created = await tx.order.create({
        data: {
          userId, addressId: data.addressId, couponId,
          subtotal, discount, shippingCost, total,
          status: 'pending', paymentMethod: data.paymentMethod, paymentStatus: 'pending',
          notes: data.notes,
          items: { create: orderItemsData },
          statusHistory: { create: { status: 'pending', note: 'Pedido criado' } },
        },
        include: { items: true, address: true },
      })

      for (const item of cartItems as typeof cartItems) {
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      if (couponId) {
        await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } })
      }

      await tx.cartItem.deleteMany({ where: { userId } })
      return created
    })

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user) {
      void sendEmail({
        to: user.email,
        subject: `Pedido #${order.id.slice(0, 8).toUpperCase()} recebido — FD Store`,
        html: orderConfirmationEmail({
          userName: user.name,
          orderId: order.id,
          total: Number(order.total),
          items: order.items.map((i: { productName: string; quantity: number; unitPrice: unknown }) => ({ name: i.productName, quantity: i.quantity, unitPrice: Number(i.unitPrice) })),
        }),
      })
    }

    return order
  }

  async listByUser(userId: string, req: Request) {
    const pagination = getPagination(req)
    const where = { userId }
    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where, orderBy: { createdAt: 'desc' }, skip: pagination.skip, take: pagination.limit,
        include: {
          items: { select: { productName: true, quantity: true, unitPrice: true, productImage: true, color: true, size: true } },
          payment: { select: { status: true, method: true } },
        },
      }),
      prisma.order.count({ where }),
    ])
    return buildPaginatedResponse(data, total, pagination)
  }

  async findById(id: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            customization: true, variant: true,
            product: { select: { name: true, images: { where: { isPrimary: true }, select: { url: true } } } },
          },
        },
        address: true, payment: true,
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!order) throw new NotFoundError('Pedido')
    if (userId && order.userId !== userId) throw new ForbiddenError()
    return order
  }

  async cancel(id: string, userId: string) {
    const order = await prisma.order.findFirst({ where: { id, userId } })
    if (!order) throw new NotFoundError('Pedido')
    if (!['pending', 'confirmed'].includes(order.status))
      throw new AppError('Pedido não pode ser cancelado neste status', 400, 'CANNOT_CANCEL')

    const items = await prisma.orderItem.findMany({ where: { orderId: id } })

    await prisma.$transaction(async (tx: TxClient) => {
      await tx.order.update({
        where: { id },
        data: { status: 'cancelled', statusHistory: { create: { status: 'cancelled', note: 'Cancelado pelo cliente' } } },
      })
      for (const item of items) {
        await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } })
      }
    })
  }

  async listAll(req: Request) {
    const pagination = getPagination(req)
    const status = req.query.status as string | undefined
    const where = status ? { status } : {}
    const [data, total] = await Promise.all([
      prisma.order.findMany({
        where, orderBy: { createdAt: 'desc' }, skip: pagination.skip, take: pagination.limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { select: { productName: true, quantity: true, color: true, size: true } },
          payment: { select: { status: true, method: true } },
        },
      }),
      prisma.order.count({ where }),
    ])
    return buildPaginatedResponse(data, total, pagination)
  }

  async updateStatus(id: string, data: UpdateOrderStatusDto) {
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) throw new NotFoundError('Pedido')
    return prisma.order.update({
      where: { id },
      data: { status: data.status, trackingCode: data.trackingCode, statusHistory: { create: { status: data.status, note: data.note } } },
    })
  }
}

export const ordersService = new OrdersService()
