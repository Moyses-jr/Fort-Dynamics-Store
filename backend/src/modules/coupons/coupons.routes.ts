// src/modules/coupons/coupons.routes.ts
import { Router, Request, Response } from 'express'
import { prisma } from '../../config/database'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { adminMiddleware } from '../../middlewares/admin.middleware'
import { validate } from '../../middlewares/validate.middleware'
import { AppError, NotFoundError } from '../../shared/errors/AppError'
import { z } from 'zod'

const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  type: z.enum(['percent', 'fixed']),
  value: z.number().positive(),
  maxUses: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().datetime().optional(),
})

const validateCouponSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
})

export const couponsRouter = Router()

// Valida cupom (usuário autenticado)
couponsRouter.post(
  '/validate',
  authMiddleware,
  validate(validateCouponSchema),
  async (req: Request, res: Response) => {
    const { code, subtotal } = req.body as { code: string; subtotal: number }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    })

    if (!coupon || !coupon.isActive) throw new AppError('Cupom inválido', 400, 'INVALID_COUPON')
    if (coupon.expiresAt && coupon.expiresAt < new Date())
      throw new AppError('Cupom expirado', 400, 'EXPIRED_COUPON')
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses)
      throw new AppError('Cupom esgotado', 400, 'COUPON_EXHAUSTED')

    const discount =
      coupon.type === 'percent' ? subtotal * (Number(coupon.value) / 100) : Number(coupon.value)

    res.json({
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      discount: Math.min(discount, subtotal),
    })
  },
)

// Admin
couponsRouter.get('/', authMiddleware, adminMiddleware, async (_req, res) => {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  res.json(coupons)
})

couponsRouter.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validate(createCouponSchema),
  async (req: Request, res: Response) => {
    const data = req.body as z.infer<typeof createCouponSchema>
    const coupon = await prisma.coupon.create({ data })
    res.status(201).json(coupon)
  },
)

couponsRouter.patch(
  '/:id',
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response) => {
    const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } })
    if (!coupon) throw new NotFoundError('Cupom')

    const updated = await prisma.coupon.update({
      where: { id: req.params.id },
      data: req.body as Record<string, unknown>,
    })
    res.json(updated)
  },
)
