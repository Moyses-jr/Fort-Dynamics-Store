// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../shared/errors/AppError'
import { logger } from '../config/logger'

// interface ErrorResponse {
//   error: true
//   code: string
//   message: string
//   statusCode: number
//   ...(process.env.NODE_ENV === 'development' ? { stack?: string } : Record<string, never>)
// }

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const response: Record<string, unknown> = {
      error: true,
      code: err.code,
      message: err.message,
      statusCode: err.statusCode,
    }

    if (process.env.NODE_ENV === 'development') {
      response.stack = err.stack
    }

    res.status(err.statusCode).json(response)
    return
  }

  // Erros não operacionais — logar e retornar 500 genérico
  logger.error('Erro não tratado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  })

  const response: Record<string, unknown> = {
    error: true,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Ocorreu um erro interno. Tente novamente.',
    statusCode: 500,
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
    response.originalMessage = err.message
  }

  res.status(500).json(response)
}
