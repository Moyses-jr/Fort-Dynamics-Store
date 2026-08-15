// src/modules/products/products.service.ts
import { productsRepository } from './products.repository'
import { NotFoundError, ConflictError } from '../../shared/errors/AppError'
import { getPagination, buildPaginatedResponse } from '../../shared/utils/pagination'
import { slugify } from '../../shared/utils/slug'
import type { Request } from 'express'
import type { ProductQueryDto, CreateProductDto, UpdateProductDto } from './products.schema'

export class ProductsService {
  async list(query: ProductQueryDto, req: Request) {
    const pagination = getPagination(req)
    const { data, total } = await productsRepository.findMany(
      {
        categorySlug: query.category,
        available: query.available,
        isFeatured: query.featured,
        isNew: query.isNew,
        isPremium: query.isPremium,
        search: query.search,
        sort: query.sort,
      },
      pagination,
    )
    return buildPaginatedResponse(data, total, pagination)
  }

  async findById(id: string) {
    const product = await productsRepository.findById(id)
    if (!product) throw new NotFoundError('Produto')
    return product
  }

  async findFeatured() {
    return productsRepository.findFeatured()
  }

  async create(data: CreateProductDto) {
    const slug = await this.generateUniqueSlug(data.name)
    return productsRepository.create({ ...data, slug })
  }

  async update(id: string, data: UpdateProductDto) {
    const exists = await productsRepository.findById(id)
    if (!exists) throw new NotFoundError('Produto')

    const payload: UpdateProductDto & { slug?: string } = { ...data }
    if (data.name && data.name !== exists.name) {
      payload.slug = await this.generateUniqueSlug(data.name, id)
    }

    return productsRepository.update(id, payload)
  }

  private async generateUniqueSlug(name: string, ignoreId?: string) {
    const slug = slugify(name)
    const existing = await productsRepository.findBySlug(slug)
    if (existing && existing.id !== ignoreId) {
      throw new ConflictError('Já existe um produto com um nome muito similar')
    }
    return slug
  }

  async remove(id: string) {
    const exists = await productsRepository.findById(id)
    if (!exists) throw new NotFoundError('Produto')
    await productsRepository.softDelete(id)
  }
}

export const productsService = new ProductsService()
