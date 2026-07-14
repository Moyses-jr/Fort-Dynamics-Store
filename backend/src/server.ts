// src/server.ts
import { app } from './app'
import { env } from './config/env'
import { prisma } from './config/database'
import { redis } from './config/redis'
import { logger } from './config/logger'

async function bootstrap() {
  // Conecta Redis
  await redis.connect()

  // Verifica conexão com banco
  await prisma.$connect()
  logger.info('PostgreSQL conectado')

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 FD Store API rodando na porta ${env.PORT} [${env.NODE_ENV}]`)
  })

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Recebido ${signal}. Encerrando servidor...`)

    server.close(async () => {
      await prisma.$disconnect()
      await redis.quit()
      logger.info('Servidor encerrado com sucesso.')
      process.exit(0)
    })

    // Força encerramento após 10s se travar
    setTimeout(() => {
      logger.error('Encerramento forçado após timeout')
      process.exit(1)
    }, 10_000)
  }

  process.on('SIGTERM', () => void shutdown('SIGTERM'))
  process.on('SIGINT', () => void shutdown('SIGINT'))

  process.on('uncaughtException', err => {
    logger.error('Exceção não capturada:', err)
    process.exit(1)
  })

  process.on('unhandledRejection', reason => {
    logger.error('Promise rejeitada não tratada:', reason)
    process.exit(1)
  })
}

void bootstrap()
