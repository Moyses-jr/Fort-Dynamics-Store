// src/modules/products/products.schema.ts
import { z } from 'zod'

export const productQuerySchema = z.object({
  category: z.string().optional(),
  available: z
    .string()
    .transform(v => v === 'true')
    .optional(),
  featured: z
    .string()
    .transform(v => v === 'true')
    .optional(),
  isNew: z
    .string()
    .transform(v => v === 'true')
    .optional(),
  isPremium: z
    .string()
    .transform(v => v === 'true')
    .optional(),
  search: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'featured']).optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
})

const productImageSchema = z.object({
  url: z.string().url(),
  isPrimary: z.boolean(),
  order: z.number().int().min(0),
})

const productVariantSchema = z.object({
  variantId: z.string().min(1),
  color: z.string().min(1),
  size: z.string().min(1),
  stock: z.number().int().min(0),
  available: z.boolean().optional(),
})

export const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(220),
  description: z.string().min(1),
  fabricType: z.string().min(1),
  priceFront: z.number().min(0),
  priceBack: z.number().min(0),
  priceBoth: z.number().min(0),
  requiresBudget: z.boolean().optional(),
  available: z.boolean().optional(),
  badge: z.string().optional(),
  obs: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  isPremium: z.boolean().optional(),
  images: z.array(productImageSchema).min(1),
  variants: z.array(productVariantSchema).min(1),
})

export const updateProductSchema = createProductSchema
  .partial()
  .omit({ images: true, variants: true })

export type ProductQueryDto = z.infer<typeof productQuerySchema>
export type CreateProductDto = z.infer<typeof createProductSchema>
export type UpdateProductDto = z.infer<typeof updateProductSchema>
