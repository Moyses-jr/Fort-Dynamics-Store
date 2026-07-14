// src/modules/payments/payments.routes.ts
import { Router } from 'express'
import { paymentsController } from './payments.controller'
import { validate } from '../../middlewares/validate.middleware'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { cardPaymentSchema } from './payments.schema'
import express from 'express'

export const paymentsRouter = Router()

// Webhook precisa do body raw para validar assinatura MP
paymentsRouter.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentsController.webhook.bind(paymentsController),
)

// Rotas autenticadas
paymentsRouter.post(
  '/pix/:orderId',
  authMiddleware,
  paymentsController.createPix.bind(paymentsController),
)
paymentsRouter.post(
  '/card/:orderId',
  authMiddleware,
  validate(cardPaymentSchema),
  paymentsController.createCard.bind(paymentsController),
)
paymentsRouter.post(
  '/boleto/:orderId',
  authMiddleware,
  paymentsController.createBoleto.bind(paymentsController),
)
