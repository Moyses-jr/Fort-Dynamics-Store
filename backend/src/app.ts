// src/app.ts
import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import { env } from './config/env'
import { logger } from './config/logger'
import { errorMiddleware } from './middlewares/error.middleware'

import { authRouter } from './modules/auth/auth.routes'
import { usersRouter } from './modules/users/users.routes'
import { productsRouter } from './modules/products/products.routes'
import { categoriesRouter } from './modules/categories/categories.routes'
import { cartRouter } from './modules/cart/cart.routes'
import { ordersRouter } from './modules/orders/orders.routes'
import { paymentsRouter } from './modules/payments/payments.routes'
import { couponsRouter } from './modules/coupons/coupons.routes'
import { uploadsRouter } from './modules/uploads/uploads.routes'
import { adminRouter } from './modules/admin/admin.routes'

export const app = express()

// ── Segurança ───────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true, // necessário para cookies httpOnly
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

// ── Webhook MP precisa do body raw — registrar ANTES do json() ──
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }))

// ── Body parsing ────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ── Compressão ──────────────────────────────────────────
app.use(compression())

// ── Logging HTTP ────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: msg => logger.http(msg.trim()) },
    }),
  )
}

// ── Rotas ───────────────────────────────────────────────
const API = '/api/v1'

app.use(`${API}/auth`, authRouter)
app.use(`${API}/users`, usersRouter)
app.use(`${API}/products`, productsRouter)
app.use(`${API}/categories`, categoriesRouter)
app.use(`${API}/cart`, cartRouter)
app.use(`${API}/orders`, ordersRouter)
app.use(`${API}/payments`, paymentsRouter)
app.use(`${API}/coupons`, couponsRouter)
app.use(`${API}/uploads`, uploadsRouter)
app.use(`${API}`, adminRouter)

// ── 404 ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    error: true,
    code: 'NOT_FOUND',
    message: 'Rota não encontrada',
    statusCode: 404,
  })
})

// ── Error handler (deve ser o último middleware) ─────────
app.use(errorMiddleware)
