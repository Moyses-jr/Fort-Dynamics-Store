// src/config/redis.ts
import { Redis } from 'ioredis'
import { env } from './env'
import { logger } from './logger'

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
})

redis.on('connect', () => logger.info('Redis conectado'))
redis.on('error', err => logger.error('Redis erro:', err))
