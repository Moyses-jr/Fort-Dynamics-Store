// src/modules/categories/categories.routes.ts
import { Router } from 'express'
import { prisma } from '../../config/database'

export const categoriesRouter = Router()

categoriesRouter.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: { where: { available: true } } } } },
  })
  res.json(categories)
})
