// src/tests/setup.ts
import { prisma } from '../config/database'
import { redis } from '../config/redis'
import { afterAll, beforeAll } from 'vitest'

beforeAll(async () => {
  // Em testes, usa DATABASE_URL de teste se definida
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.$disconnect()
  await redis.quit()
})
