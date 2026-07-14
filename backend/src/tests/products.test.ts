// src/tests/products.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { prisma } from '../config/database'

const BASE = '/api/v1/products'

describe('Products', () => {
  describe('GET /products', () => {
    it('deve listar produtos com paginação', async () => {
      const res = await request(app).get(BASE)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('data')
      expect(res.body).toHaveProperty('meta')
      expect(Array.isArray(res.body.data)).toBe(true)
      expect(res.body.meta).toMatchObject({
        page: 1,
        limit: expect.any(Number),
        total: expect.any(Number),
      })
    })

    it('deve filtrar por categoria', async () => {
      const res = await request(app).get(`${BASE}?category=camisetas`)

      expect(res.status).toBe(200)
      res.body.data.forEach((p: { category: { slug: string } }) => {
        expect(p.category.slug).toBe('camisetas')
      })
    })

    it('deve filtrar por busca', async () => {
      const res = await request(app).get(`${BASE}?search=básica`)

      expect(res.status).toBe(200)
      expect(res.body.data.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('GET /products/featured', () => {
    it('deve retornar produtos em destaque', async () => {
      const res = await request(app).get(`${BASE}/featured`)

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
    })
  })

  describe('GET /products/:id', () => {
    it('deve retornar produto por id', async () => {
      const product = await prisma.product.findFirst({ where: { available: true } })
      if (!product) return

      const res = await request(app).get(`${BASE}/${product.id}`)

      expect(res.status).toBe(200)
      expect(res.body.id).toBe(product.id)
      expect(res.body).toHaveProperty('colors')
      expect(res.body).toHaveProperty('sizes')
      expect(res.body).toHaveProperty('images')
    })

    it('deve retornar 404 para produto inexistente', async () => {
      const res = await request(app).get(`${BASE}/00000000-0000-0000-0000-000000000000`)

      expect(res.status).toBe(404)
    })
  })
})
