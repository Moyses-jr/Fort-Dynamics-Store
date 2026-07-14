// src/modules/users/users.schema.ts
import { z } from 'zod'

export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
})

export const createAddressSchema = z.object({
  street: z.string().min(1),
  number: z.string().min(1),
  complement: z.string().optional(),
  neighborhood: z.string().min(1),
  city: z.string().min(1),
  state: z.string().length(2, 'Estado deve ter 2 letras').toUpperCase(),
  zipCode: z.string().regex(/^\d{8}$/, 'CEP deve ter 8 dígitos'),
  isDefault: z.boolean().optional(),
})

export const updateAddressSchema = createAddressSchema.partial()

export type UpdateUserDto = z.infer<typeof updateUserSchema>
export type CreateAddressDto = z.infer<typeof createAddressSchema>
export type UpdateAddressDto = z.infer<typeof updateAddressSchema>
