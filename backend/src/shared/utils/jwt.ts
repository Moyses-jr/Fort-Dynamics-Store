// src/shared/utils/jwt.ts
import jwt from 'jsonwebtoken'
import { env } from '../../config/env'
import { UnauthorizedError } from '../errors/AppError'
import type { UserRole } from '../types/prisma'

export interface JwtPayload {
  userId: string
  role: UserRole
}

export interface RefreshPayload {
  userId: string
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function signRefreshToken(payload: RefreshPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  } as jwt.SignOptions)
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload
  } catch {
    throw new UnauthorizedError('Token inválido ou expirado')
  }
}

export function verifyRefreshToken(token: string): RefreshPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshPayload
  } catch {
    throw new UnauthorizedError('Refresh token inválido ou expirado')
  }
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload
  } catch {
    return null
  }
}
