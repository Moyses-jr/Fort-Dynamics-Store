// src/modules/orders/orders.schema.ts
import { z } from 'zod'

export const createOrderSchema = z.object({
  addressId: z.string().uuid('Endereço inválido'),
  paymentMethod: z.enum(['pix', 'credit_card', 'boleto']),
  couponCode: z.string().optional(),
  notes: z.string().max(500).optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'production', 'shipping', 'delivered', 'cancelled']),
  note: z.string().optional(),
  trackingCode: z.string().optional(),
})

export type CreateOrderDto = z.infer<typeof createOrderSchema>
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>
