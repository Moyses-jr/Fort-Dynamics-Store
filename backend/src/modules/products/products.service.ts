// src/modules/products/products.service.ts
import { productsRepository } from './products.repository'
import { NotFoundError } from '../../shared/errors/AppError'
import { getPagination, buildPaginatedResponse } from '../../shared/utils/pagination'
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
    return productsRepository.create(data)
  }

  async update(id: string, data: UpdateProductDto) {
    const exists = await productsRepository.findById(id)
    if (!exists) throw new NotFoundError('Produto')
    return productsRepository.update(id, data)
  }

  async remove(id: string) {
    const exists = await productsRepository.findById(id)
    if (!exists) throw new NotFoundError('Produto')
    await productsRepository.softDelete(id)
  }
}

export const productsService = new ProductsService()
