// src/modules/payments/payments.schema.ts
import { z } from 'zod'

export const cardPaymentSchema = z.object({
  token: z.string().min(1, 'Token do cartão obrigatório'),
  installments: z.number().int().min(1).max(12),
  paymentMethodId: z.string().min(1),
  issuerId: z.number().optional(),
})

export type CardPaymentDto = z.infer<typeof cardPaymentSchema>
