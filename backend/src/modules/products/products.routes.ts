// src/modules/products/products.routes.ts
import { Router } from 'express'
import { productsController } from './products.controller'
import { validate } from '../../middlewares/validate.middleware'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { adminMiddleware } from '../../middlewares/admin.middleware'
import { productQuerySchema, createProductSchema, updateProductSchema } from './products.schema'

export const productsRouter = Router()

// Públicos
productsRouter.get(
  '/',
  validate(productQuerySchema, 'query'),
  productsController.list.bind(productsController),
)
productsRouter.get('/featured', productsController.findFeatured.bind(productsController))
productsRouter.get('/:id', productsController.findById.bind(productsController))

// Admin
productsRouter.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validate(createProductSchema),
  productsController.create.bind(productsController),
)
productsRouter.patch(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(updateProductSchema),
  productsController.update.bind(productsController),
)
productsRouter.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  productsController.remove.bind(productsController),
)
