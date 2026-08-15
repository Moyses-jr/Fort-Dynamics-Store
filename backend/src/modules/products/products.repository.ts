// src/modules/products/products.repository.ts
import { prisma } from '../../config/database'
import type { PaginationParams } from '../../shared/utils/pagination'

export interface ProductFilters {
  categorySlug?: string
  available?: boolean
  isFeatured?: boolean
  isNew?: boolean
  isPremium?: boolean
  search?: string
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'featured'
}

const productSelect = {
  id: true,
  categoryId: true,
  name: true,
  slug: true,
  description: true,
  fabricType: true,
  priceFront: true,
  priceBack: true,
  priceBoth: true,
  requiresBudget: true,
  available: true,
  badge: true,
  obs: true,
  isFeatured: true,
  isNew: true,
  isPremium: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  images: {
    orderBy: { order: 'asc' as const },
    select: { id: true, url: true, isPrimary: true, order: true },
  },
  variants: {
    orderBy: [{ color: 'asc' as const }, { size: 'asc' as const }],
    select: { id: true, variantId: true, color: true, size: true, stock: true, available: true },
  },
}

export class ProductsRepository {
  async findMany(filters: ProductFilters, pagination: PaginationParams) {
    const where: Record<string, unknown> = {}

    if (filters.available !== undefined) where.available = filters.available
    if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured
    if (filters.isNew !== undefined) where.isNew = filters.isNew
    if (filters.isPremium !== undefined) where.isPremium = filters.isPremium

    if (filters.categorySlug) {
      where.category = { slug: filters.categorySlug }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { fabricType: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const orderBy = this.buildOrderBy(filters.sort)

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.limit,
        select: productSelect,
      }),
      prisma.product.count({ where }),
    ])

    return { data, total }
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      select: productSelect,
    })
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug }, select: { id: true } })
  }

  async findFeatured(limit = 8) {
    return prisma.product.findMany({
      where: { isFeatured: true, available: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: productSelect,
    })
  }

  async create(data: ProductCreateData) {
    const { images, variants, ...productData } = data

    return prisma.product.create({
      data: {
        ...productData,
        images: { create: images },
        variants: { create: variants },
      },
      select: productSelect,
    })
  }

  async update(id: string, data: ProductUpdateData) {
    return prisma.product.update({
      where: { id },
      data,
      select: productSelect,
    })
  }

  async softDelete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { available: false },
    })
  }

  async decrementStock(variantId: string, quantity: number) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: { decrement: quantity } },
    })
  }

  async incrementStock(variantId: string, quantity: number) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data: { stock: { increment: quantity } },
    })
  }

  private buildOrderBy(sort?: string) {
    switch (sort) {
      case 'price_asc':
        return { priceBoth: 'asc' as const }
      case 'price_desc':
        return { priceBoth: 'desc' as const }
      case 'newest':
        return { createdAt: 'desc' as const }
      case 'featured':
      default:
        return [{ isFeatured: 'desc' as const }, { createdAt: 'desc' as const }]
    }
  }
}

export interface ProductCreateData {
  categoryId: string
  name: string
  slug: string
  description: string
  fabricType: string
  priceFront: number
  priceBack: number
  priceBoth: number
  requiresBudget?: boolean
  available?: boolean
  badge?: string
  obs?: string
  isFeatured?: boolean
  isNew?: boolean
  isPremium?: boolean
  images: Array<{ url: string; isPrimary: boolean; order: number }>
  variants: Array<{
    variantId: string
    color: string
    size: string
    stock: number
    available?: boolean
  }>
}

export type ProductUpdateData = Partial<Omit<ProductCreateData, 'images' | 'variants'>>

export const productsRepository = new ProductsRepository()
