// src/modules/categories/categories.routes.ts
import { Router, Request, Response } from 'express'
import { prisma } from '../../config/database'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { adminMiddleware } from '../../middlewares/admin.middleware'
import { validate } from '../../middlewares/validate.middleware'
import { ConflictError, NotFoundError } from '../../shared/errors/AppError'
import { slugify } from '../../shared/utils/slug'
import { createCategorySchema, updateCategorySchema } from './categories.schema'
import type { CreateCategoryDto, UpdateCategoryDto } from './categories.schema'

export const categoriesRouter = Router()

// Público
categoriesRouter.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: { where: { available: true } } } } },
  })
  res.json(categories)
})

// Admin
categoriesRouter.post(
  '/',
  authMiddleware,
  adminMiddleware,
  validate(createCategorySchema),
  async (req: Request, res: Response) => {
    const { name, description, imageUrl } = req.body as CreateCategoryDto
    const slug = slugify(name)

    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) throw new ConflictError('Já existe uma categoria com esse nome')

    const category = await prisma.category.create({ data: { name, slug, description, imageUrl } })
    res.status(201).json(category)
  },
)

categoriesRouter.patch(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(updateCategorySchema),
  async (req: Request, res: Response) => {
    const current = await prisma.category.findUnique({ where: { id: req.params.id } })
    if (!current) throw new NotFoundError('Categoria')

    const { name, description, imageUrl } = req.body as UpdateCategoryDto
    const data: Record<string, unknown> = { description, imageUrl }

    if (name && name !== current.name) {
      const slug = slugify(name)
      const slugTaken = await prisma.category.findUnique({ where: { slug } })
      if (slugTaken && slugTaken.id !== current.id) {
        throw new ConflictError('Já existe uma categoria com esse nome')
      }
      data.name = name
      data.slug = slug
    }

    const category = await prisma.category.update({ where: { id: current.id }, data })
    res.json(category)
  },
)

categoriesRouter.delete(
  '/:id',
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response) => {
    const current = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { products: true } } },
    })
    if (!current) throw new NotFoundError('Categoria')
    if (current._count.products > 0) {
      throw new ConflictError('Não é possível excluir uma categoria com produtos vinculados')
    }

    await prisma.category.delete({ where: { id: current.id } })
    res.status(204).send()
  },
)
