// src/modules/products/products.controller.ts
import { Request, Response } from 'express'
import { productsService } from './products.service'
import type { ProductQueryDto, CreateProductDto, UpdateProductDto } from './products.schema'

export class ProductsController {
  async list(req: Request, res: Response): Promise<void> {
    const result = await productsService.list(req.query as ProductQueryDto, req)
    res.json(result)
  }

  async findById(req: Request, res: Response): Promise<void> {
    const product = await productsService.findById(req.params.id)
    res.json(product)
  }

  async findFeatured(_req: Request, res: Response): Promise<void> {
    const products = await productsService.findFeatured()
    res.json(products)
  }

  async create(req: Request, res: Response): Promise<void> {
    const product = await productsService.create(req.body as CreateProductDto)
    res.status(201).json(product)
  }

  async update(req: Request, res: Response): Promise<void> {
    const product = await productsService.update(req.params.id, req.body as UpdateProductDto)
    res.json(product)
  }

  async remove(req: Request, res: Response): Promise<void> {
    await productsService.remove(req.params.id)
    res.status(204).send()
  }
}

export const productsController = new ProductsController()
