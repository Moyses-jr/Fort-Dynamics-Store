// src/modules/auth/auth.service.ts
import crypto from 'crypto'
import { prisma } from '../../config/database'
import { redis } from '../../config/redis'
import { env } from '../../config/env'
import { hashPassword, comparePassword } from '../../shared/utils/bcrypt'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../shared/utils/jwt'
import { sendEmail, passwordResetEmail } from '../../shared/utils/email'
import { AppError, ConflictError, UnauthorizedError } from '../../shared/errors/AppError'
import type { RegisterDto, LoginDto } from './auth.schema'

export class AuthService {
  async register(data: RegisterDto) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) throw new ConflictError('Email ja cadastrado')

    if (data.cpf) {
      const cpfExists = await prisma.user.findFirst({ where: { cpf: data.cpf } })
      if (cpfExists) throw new ConflictError('CPF ja cadastrado')
    }

    const passwordHash = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        cpf: data.cpf,
        passwordHash,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    const accessToken = signAccessToken({ userId: user.id, role: user.role })
    const refreshToken = signRefreshToken({ userId: user.id })

    return { user, accessToken, refreshToken }
  }

  async login(data: LoginDto) {
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) throw new UnauthorizedError('Email ou senha incorretos')
    if (!user.isActive) throw new UnauthorizedError('Conta desativada')

    const valid = await comparePassword(data.password, user.passwordHash)
    if (!valid) throw new UnauthorizedError('Email ou senha incorretos')

    const accessToken = signAccessToken({ userId: user.id, role: user.role })
    const refreshToken = signRefreshToken({ userId: user.id })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    }
  }

  async refresh(refreshToken: string) {
    const isBlacklisted = await redis.get(`blacklist:refresh:${refreshToken}`)
    if (isBlacklisted) throw new UnauthorizedError('Refresh token revogado')

    const payload = verifyRefreshToken(refreshToken)

    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    if (!user || !user.isActive) throw new UnauthorizedError('Usuario nao encontrado ou inativo')

    const newAccessToken = signAccessToken({ userId: user.id, role: user.role })
    const newRefreshToken = signRefreshToken({ userId: user.id })

    await redis.set(`blacklist:refresh:${refreshToken}`, '1', 'EX', 60 * 60 * 24 * 7)

    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  async logout(accessToken: string, refreshToken?: string) {
    await redis.set(`blacklist:${accessToken}`, '1', 'EX', 60 * 15)

    if (refreshToken) {
      await redis.set(`blacklist:refresh:${refreshToken}`, '1', 'EX', 60 * 60 * 24 * 7)
    }
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) return

    const token = crypto.randomBytes(32).toString('hex')
    await redis.set(`reset:${token}`, user.id, 'EX', 60 * 60)

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`

    await sendEmail({
      to: user.email,
      subject: 'Redefinicao de senha - FD Store',
      html: passwordResetEmail({ userName: user.name, resetUrl }),
    })
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await redis.get(`reset:${token}`)
    if (!userId) throw new AppError('Token invalido ou expirado', 400, 'INVALID_TOKEN')

    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } })

    await redis.del(`reset:${token}`)
  }
}

export const authService = new AuthService()
