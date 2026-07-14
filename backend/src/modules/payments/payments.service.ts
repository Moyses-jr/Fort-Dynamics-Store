// src/modules/payments/payments.service.ts
import { prisma } from '../../config/database'
import type { PrismaClient } from '@prisma/client'
import { NotFoundError, AppError, ForbiddenError } from '../../shared/errors/AppError'
import { logger } from '../../config/logger'
import { createPixPayment, createCardPayment, createBoletoPayment } from './mercadopago.provider'
import type { CardPaymentDto } from './payments.schema'
import type { JsonValue } from '../../shared/types/prisma'

type TxClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export class PaymentsService {
  async createPix(orderId: string, userId: string) {
    const order = await this.getValidOrder(orderId, userId)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundError('Usuário')

    const pixData = await createPixPayment({
      orderId,
      amount: Number(order.total),
      description: `FD Store - Pedido #${orderId.slice(0, 8).toUpperCase()}`,
      payer: {
        email: user.email,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' ') || 'Store',
        cpf: user.cpf ?? undefined,
      },
    })

    await prisma.payment.upsert({
      where: { orderId },
      update: { providerId: pixData.paymentId, method: 'pix', status: 'pending', metadata: pixData as unknown as JsonValue },
      create: { orderId, providerId: pixData.paymentId, method: 'pix', status: 'pending', amount: order.total, metadata: pixData as unknown as JsonValue },
    })

    return pixData
  }

  async createCard(orderId: string, userId: string, data: CardPaymentDto) {
    const order = await this.getValidOrder(orderId, userId)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundError('Usuário')

    const cardData = await createCardPayment({
      orderId,
      amount: Number(order.total),
      description: `FD Store - Pedido #${orderId.slice(0, 8).toUpperCase()}`,
      token: data.token,
      installments: data.installments,
      paymentMethodId: data.paymentMethodId,
      issuerId: data.issuerId,
      payer: {
        email: user.email,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' ') || 'Store',
        cpf: user.cpf ?? undefined,
      },
    })

    const payment = await prisma.payment.upsert({
      where: { orderId },
      update: { providerId: cardData.paymentId, method: 'credit_card', status: cardData.status, metadata: cardData as unknown as JsonValue },
      create: { orderId, providerId: cardData.paymentId, method: 'credit_card', status: cardData.status, amount: order.total, metadata: cardData as unknown as JsonValue },
    })

    if (cardData.status === 'approved') await this.confirmOrder(orderId)

    return { payment, cardData }
  }

  async createBoleto(orderId: string, userId: string) {
    const order = await this.getValidOrder(orderId, userId)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundError('Usuário')

    const address = await prisma.address.findUnique({ where: { id: order.addressId } })
    if (!address) throw new NotFoundError('Endereço')

    const boletoData = await createBoletoPayment({
      orderId,
      amount: Number(order.total),
      description: `FD Store - Pedido #${orderId.slice(0, 8).toUpperCase()}`,
      payer: {
        email: user.email,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ').slice(1).join(' ') || 'Store',
        cpf: user.cpf ?? undefined,
        address: { street: address.street, number: address.number, city: address.city, state: address.state, zipCode: address.zipCode },
      },
    })

    await prisma.payment.upsert({
      where: { orderId },
      update: { providerId: boletoData.paymentId, method: 'boleto', status: 'pending', metadata: boletoData as unknown as JsonValue },
      create: { orderId, providerId: boletoData.paymentId, method: 'boleto', status: 'pending', amount: order.total, metadata: boletoData as unknown as JsonValue },
    })

    return boletoData
  }

  async handleWebhook(body: Record<string, unknown>) {
    const type = body.type as string
    const data = body.data as Record<string, unknown> | undefined

    logger.info('Webhook MP recebido:', { type, data })
    if (type !== 'payment' || !data?.id) return

    const providerId = String(data.id)
    const payment = await prisma.payment.findFirst({ where: { providerId } })
    if (!payment) { logger.warn(`Pagamento não encontrado: ${providerId}`); return }

    const { MercadoPagoConfig, Payment: MpPayment } = await import('mercadopago')
    const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! })
    const mpPaymentApi = new MpPayment(mpClient)
    const mpData = await mpPaymentApi.get({ id: providerId })
    const status = mpData.status ?? 'pending'

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status, paidAt: status === 'approved' ? new Date() : undefined, metadata: mpData as unknown as JsonValue },
    })

    if (status === 'approved') await this.confirmOrder(payment.orderId)
    else if (status === 'rejected' || status === 'cancelled') await this.failOrder(payment.orderId)
  }

  private async getValidOrder(orderId: string, userId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new NotFoundError('Pedido')
    if (order.userId !== userId) throw new ForbiddenError()
    if (order.paymentStatus === 'paid') throw new AppError('Pedido já pago', 400, 'ALREADY_PAID')
    return order
  }

  private async confirmOrder(orderId: string) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'confirmed', paymentStatus: 'paid', statusHistory: { create: { status: 'confirmed', note: 'Pagamento confirmado' } } },
    })
    logger.info(`Pedido confirmado: ${orderId}`)
  }

  private async failOrder(orderId: string) {
    const items = await prisma.orderItem.findMany({ where: { orderId } })
    await prisma.$transaction(async (tx: TxClient) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'cancelled', paymentStatus: 'failed', statusHistory: { create: { status: 'cancelled', note: 'Pagamento recusado' } } },
      })
      for (const item of items) {
        await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { increment: item.quantity } } })
      }
    })
    logger.info(`Pedido cancelado por falha: ${orderId}`)
  }
}

export const paymentsService = new PaymentsService()
