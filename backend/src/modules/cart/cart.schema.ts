// src/modules/cart/cart.schema.ts
import { z } from 'zod'

export const addToCartSchema = z.object({
  productId: z.string().uuid('productId inválido'),
  variantId: z.string().uuid('variantId inválido'),
  quantity: z.number().int().min(1).max(99),
  customization: z
    .object({
      printOption: z.enum(['frente', 'verso', 'fronteVerso']),
      colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Cor inválida'),
      colorName: z.string().min(1),
      size: z.string().min(1),
      artUrl: z.string().url().optional(),
      aiPrompt: z.string().optional(),
      extra: z.record(z.unknown()).optional(),
    })
    .optional(),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(99),
})

export type AddToCartDto = z.infer<typeof addToCartSchema>
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>
