// src/modules/users/users.routes.ts
import { Router } from 'express'
import { usersController } from './users.controller'
import { validate } from '../../middlewares/validate.middleware'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { adminMiddleware } from '../../middlewares/admin.middleware'
import { updateUserSchema, createAddressSchema, updateAddressSchema } from './users.schema'

export const usersRouter = Router()

usersRouter.use(authMiddleware)

// Perfil
usersRouter.get('/me', usersController.getMe.bind(usersController))
usersRouter.patch('/me', validate(updateUserSchema), usersController.update.bind(usersController))

// Endereços
usersRouter.get('/me/addresses', usersController.getAddresses.bind(usersController))
usersRouter.post(
  '/me/addresses',
  validate(createAddressSchema),
  usersController.createAddress.bind(usersController),
)
usersRouter.patch(
  '/me/addresses/:id',
  validate(updateAddressSchema),
  usersController.updateAddress.bind(usersController),
)
usersRouter.delete('/me/addresses/:id', usersController.deleteAddress.bind(usersController))

// Favoritos
usersRouter.get('/me/favorites', usersController.getFavorites.bind(usersController))
usersRouter.post('/me/favorites/:productId', usersController.addFavorite.bind(usersController))
usersRouter.delete('/me/favorites/:productId', usersController.removeFavorite.bind(usersController))

// Admin
usersRouter.get('/', adminMiddleware, usersController.listAll.bind(usersController))
usersRouter.patch('/:id/active', adminMiddleware, usersController.setActive.bind(usersController))
