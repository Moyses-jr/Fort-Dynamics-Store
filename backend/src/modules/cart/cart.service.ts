// src/modules/cart/cart.service.ts
import { prisma } from '../../config/database'
import { NotFoundError, AppError } from '../../shared/errors/AppError'
import type { AddToCartDto, UpdateCartItemDto } from './cart.schema'
import { Prisma } from '@prisma/client'

interface CartItemWithRelations {
  customization: { printOption: string } | null
  product: {
    priceFront: unknown
    priceBack: unknown
    priceBoth: unknown
  }
}

export class CartService {
  async getCart(userId: string) {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            priceFront: true,
            priceBack: true,
            priceBoth: true,
            available: true,
            images: { where: { isPrimary: true }, select: { url: true } },
          },
        },
        variant: true,
        customization: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    const enriched = items.map((item: (typeof items)[number]) => {
      const unitPrice = this.resolvePrice(item)
      return {
        ...item,
        unitPrice,
        subtotal: unitPrice * item.quantity,
      }
    })

    const subtotal = (enriched as Array<{ subtotal: number }>).reduce(
      (sum: number, item: { subtotal: number }) => sum + item.subtotal,
      0,
    )
    const shipping = subtotal >= 299 ? 0 : 20
    const total = subtotal + shipping

    return { items: enriched, subtotal, shipping, total }
  }

  async addItem(userId: string, data: AddToCartDto) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: data.variantId },
      include: { product: true },
    })

    if (!variant) throw new NotFoundError('Variante do produto')
    if (variant.productId !== data.productId)
      throw new AppError('Variante não pertence ao produto informado', 400, 'INVALID_VARIANT')
    if (!variant.product.available)
      throw new AppError('Produto indisponível', 400, 'PRODUCT_UNAVAILABLE')
    if (!variant.available) throw new AppError('Variante indisponível', 400, 'VARIANT_UNAVAILABLE')
    if (variant.product.requiresBudget)
      throw new AppError('Produto requer orçamento', 400, 'REQUIRES_BUDGET')
    if (variant.stock < data.quantity) {
      throw new AppError(
        `Estoque insuficiente. Disponível: ${variant.stock}`,
        400,
        'INSUFFICIENT_STOCK',
      )
    }

    let customizationId: string | undefined

    if (data.customization) {
      const customization = await prisma.customization.create({
        data: {
          ...data.customization,
          extra: (data.customization.extra ?? null) as Prisma.InputJsonValue,
        },
      })
      customizationId = customization.id
    }

    return prisma.cartItem.create({
      data: {
        userId,
        productId: variant.productId,
        variantId: variant.id,
        quantity: data.quantity,
        customizationId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            priceFront: true,
            priceBack: true,
            priceBoth: true,
            images: { where: { isPrimary: true }, select: { url: true } },
          },
        },
        variant: true,
        customization: true,
      },
    })
  }

  async updateItem(userId: string, itemId: string, data: UpdateCartItemDto) {
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, userId },
      include: { variant: true },
    })
    if (!item) throw new NotFoundError('Item do carrinho')

    if (!item.variant.available)
      throw new AppError('Variante indisponível', 400, 'VARIANT_UNAVAILABLE')
    if (item.variant.stock < data.quantity) {
      throw new AppError(
        `Estoque insuficiente. Disponível: ${item.variant.stock}`,
        400,
        'INSUFFICIENT_STOCK',
      )
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: data.quantity },
      include: { product: true, variant: true, customization: true },
    })
  }

  async removeItem(userId: string, itemId: string) {
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, userId } })
    if (!item) throw new NotFoundError('Item do carrinho')
    await prisma.cartItem.delete({ where: { id: itemId } })
  }

  async clearCart(userId: string) {
    await prisma.cartItem.deleteMany({ where: { userId } })
  }

  private resolvePrice(item: CartItemWithRelations): number {
    const printOption = item.customization?.printOption ?? 'fronteVerso'
    if (printOption === 'frente') return Number(item.product.priceFront)
    if (printOption === 'verso') return Number(item.product.priceBack)
    return Number(item.product.priceBoth)
  }
}

export const cartService = new CartService()
