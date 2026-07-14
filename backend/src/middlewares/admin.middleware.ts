// src/middlewares/admin.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../shared/errors/AppError'
import { UserRole } from '../shared/types/prisma'

export function adminMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.user?.role !== UserRole.ADMIN) {
    throw new ForbiddenError('Acesso restrito a administradores')
  }
  next()
}
