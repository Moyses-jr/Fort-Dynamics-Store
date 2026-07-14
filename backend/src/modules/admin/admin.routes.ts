// src/modules/admin/admin.routes.ts
import { Router, Request, Response } from 'express'
import { prisma } from '../../config/database'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { adminMiddleware } from '../../middlewares/admin.middleware'
import { fetchCep } from '../../shared/utils/cep'
import { redis } from '../../config/redis'
import { UserRole } from '../../shared/types/prisma'

export const adminRouter = Router()

// Health check (publico)
adminRouter.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    await redis.ping()
    res.json({ status: 'ok', db: 'ok', redis: 'ok', timestamp: new Date().toISOString() })
  } catch {
    res.status(503).json({ status: 'error' })
  }
})

// CEP (autenticado)
adminRouter.get('/cep/:cep', authMiddleware, async (req: Request, res: Response) => {
  const { cep } = req.params
  const cacheKey = `cep:${cep}`

  // Tenta cache primeiro
  const cached = await redis.get(cacheKey)
  if (cached) {
    res.json(JSON.parse(cached))
    return
  }

  const result = await fetchCep(cep)

  // Cache por 24h
  await redis.set(cacheKey, JSON.stringify(result), 'EX', 60 * 60 * 24)

  res.json(result)
})

// Stats (admin)
adminRouter.get('/stats', authMiddleware, adminMiddleware, async (_req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    totalOrders,
    totalRevenue,
    totalCustomers,
    newOrdersToday,
    revenueToday,
    ordersByStatus,
    topProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: 'paid' },
    }),
    prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: 'paid', createdAt: { gte: today } },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),
  ])

  res.json({
    totalOrders,
    totalRevenue: Number(totalRevenue._sum.total ?? 0),
    totalCustomers,
    newOrdersToday,
    revenueToday: Number(revenueToday._sum.total ?? 0),
    ordersByStatus: ordersByStatus.reduce(
      (acc: Record<string, number>, item: { status: string; _count: { status: number } }) => ({ ...acc, [item.status]: item._count.status }),
      {} as Record<string, number>,
    ),
    topProducts,
  })
})
