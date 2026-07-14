// src/modules/payments/payments.controller.ts
import { Request, Response } from 'express'
import { paymentsService } from './payments.service'
import type { CardPaymentDto } from './payments.schema'
import crypto from 'crypto'
import { env } from '../../config/env'
import { logger } from '../../config/logger'

export class PaymentsController {
  async createPix(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    const result = await paymentsService.createPix(req.params.orderId, userId)
    res.json(result)
  }

  async createCard(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    const result = await paymentsService.createCard(
      req.params.orderId,
      userId,
      req.body as CardPaymentDto,
    )
    res.json(result)
  }

  async createBoleto(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    const result = await paymentsService.createBoleto(req.params.orderId, userId)
    res.json(result)
  }

  webhook(req: Request, res: Response): void {
    // Valida assinatura do Mercado Pago
    const signature = req.headers['x-signature'] as string | undefined
    const requestId = req.headers['x-request-id'] as string | undefined

    if (signature && requestId) {
      const [tsPart, v1Part] = signature.split(',')
      const ts = tsPart?.split('=')?.[1]
      const v1 = v1Part?.split('=')?.[1]

      if (ts && v1) {
        const body = req.body as {
          data?: {
            id?: string | number
          }
        }

        const manifest = `id:${String(body.data?.id ?? '')};request-id:${requestId};ts:${ts};`
        const expectedHash = crypto
          .createHmac('sha256', env.MP_WEBHOOK_SECRET)
          .update(manifest)
          .digest('hex')

        if (expectedHash !== v1) {
          logger.warn('Webhook MP: assinatura inválida')
          res.status(400).json({ error: 'Invalid signature' })
          return
        }
      }
    }

    // Responde imediatamente (MP exige resposta rápida)
    res.status(200).send()

    // Processa em background
    void paymentsService.handleWebhook(req.body as Record<string, unknown>)
  }
}

export const paymentsController = new PaymentsController()
