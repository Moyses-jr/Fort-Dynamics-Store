// src/modules/cart/cart.routes.ts
import { Router } from 'express'
import { cartController } from './cart.controller'
import { validate } from '../../middlewares/validate.middleware'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { addToCartSchema, updateCartItemSchema } from './cart.schema'

export const cartRouter = Router()

cartRouter.use(authMiddleware)

cartRouter.get('/', cartController.getCart.bind(cartController))
cartRouter.post('/', validate(addToCartSchema), cartController.addItem.bind(cartController))
cartRouter.patch(
  '/:itemId',
  validate(updateCartItemSchema),
  cartController.updateItem.bind(cartController),
)
cartRouter.delete('/:itemId', cartController.removeItem.bind(cartController))
cartRouter.delete('/', cartController.clearCart.bind(cartController))
