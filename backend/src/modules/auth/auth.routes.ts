// src/modules/auth/auth.routes.ts
import { Router } from 'express'
import { authController } from './auth.controller'
import { validate } from '../../middlewares/validate.middleware'
import { authMiddleware } from '../../middlewares/auth.middleware'
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.schema'
import rateLimit from 'express-rate-limit'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: { error: true, code: 'RATE_LIMIT', message: 'Muitas tentativas. Aguarde 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const authRouter = Router()

authRouter.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register.bind(authController),
)
authRouter.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login.bind(authController),
)
authRouter.post('/refresh', authController.refresh.bind(authController))
authRouter.post('/logout', authMiddleware, authController.logout.bind(authController))
authRouter.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword.bind(authController),
)
authRouter.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword.bind(authController),
)
