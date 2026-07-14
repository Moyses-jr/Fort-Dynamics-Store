// src/modules/orders/orders.routes.ts
import { Router } from 'express'
import { ordersController } from './orders.controller'
import { validate } from '../../middlewares/validate.middleware'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { adminMiddleware } from '../../middlewares/admin.middleware'
import { createOrderSchema, updateOrderStatusSchema } from './orders.schema'

export const ordersRouter = Router()

ordersRouter.use(authMiddleware)

// Usuário autenticado
ordersRouter.get('/', ordersController.list.bind(ordersController))
ordersRouter.post('/', validate(createOrderSchema), ordersController.create.bind(ordersController))
ordersRouter.get('/:id', ordersController.findById.bind(ordersController))
ordersRouter.patch('/:id/cancel', ordersController.cancel.bind(ordersController))

// Admin
ordersRouter.get('/admin/all', adminMiddleware, ordersController.listAll.bind(ordersController))
ordersRouter.patch(
  '/admin/:id/status',
  adminMiddleware,
  validate(updateOrderStatusSchema),
  ordersController.updateStatus.bind(ordersController),
)
