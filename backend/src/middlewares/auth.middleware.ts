// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../shared/utils/jwt'
import { redis } from '../config/redis'
import { UnauthorizedError } from '../shared/errors/AppError'

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token não fornecido')
  }

  const token = authHeader.split(' ')[1]

  // Verifica blacklist (tokens invalidados no logout)
  const isBlacklisted = await redis.get(`blacklist:${token}`)
  if (isBlacklisted) {
    throw new UnauthorizedError('Token revogado')
  }

  const payload = verifyAccessToken(token)
  req.user = payload

  next()
}

export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization

  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1]
      const isBlacklisted = await redis.get(`blacklist:${token}`)
      if (!isBlacklisted) {
        req.user = verifyAccessToken(token)
      }
    } catch {
      // Silencioso — auth opcional
    }
  }

  next()
}
