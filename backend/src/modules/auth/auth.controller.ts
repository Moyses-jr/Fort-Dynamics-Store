// src/modules/auth/auth.controller.ts
import { Request, Response } from 'express'
import { authService } from './auth.service'
import type { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './auth.schema'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
}

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const dto = req.body as RegisterDto
    const { user, accessToken, refreshToken } = await authService.register(dto)

    res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS)

    res.status(201).json({ user, accessToken })
  }

  async login(req: Request, res: Response): Promise<void> {
    const dto = req.body as LoginDto
    const { user, accessToken, refreshToken } = await authService.login(dto)

    res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS)

    res.json({ user, accessToken })
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies?.refresh_token as string | undefined

    if (!refreshToken) {
      res
        .status(401)
        .json({ error: true, code: 'NO_REFRESH_TOKEN', message: 'Refresh token não encontrado' })
      return
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken)

    res.cookie('refresh_token', newRefreshToken, COOKIE_OPTIONS)

    res.json({ accessToken })
  }

  async logout(req: Request, res: Response): Promise<void> {
    const authHeader = req.headers.authorization
    const accessToken = authHeader?.split(' ')[1] ?? ''
    const refreshToken = req.cookies?.refresh_token as string | undefined

    await authService.logout(accessToken, refreshToken)

    res.clearCookie('refresh_token')
    res.status(204).send()
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body as ForgotPasswordDto
    await authService.forgotPassword(email)
    res.json({ message: 'Se o email existir, você receberá as instruções em breve.' })
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, password } = req.body as ResetPasswordDto
    await authService.resetPassword(token, password)
    res.json({ message: 'Senha redefinida com sucesso.' })
  }
}

export const authController = new AuthController()
