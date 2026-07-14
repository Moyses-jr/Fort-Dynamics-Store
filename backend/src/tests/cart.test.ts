// src/tests/cart.test.ts
import { describe, it, expect, beforeAll } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { prisma } from '../config/database'

const AUTH_BASE = '/api/v1/auth'
const CART_BASE = '/api/v1/cart'

async function loginTestUser() {
  const email = `cart.${Date.now()}@fdstore.com`
  const reg = await request(app).post(`${AUTH_BASE}/register`).send({
    name: 'Cart Tester',
    email,
    password: 'senha12345',
  })
  return (reg.body as { accessToken: string }).accessToken
}

describe('Cart', () => {
  let token: string
  let productId: string

  beforeAll(async () => {
    token = await loginTestUser()
    const product = await prisma.product.findFirst({
      where: { available: true, requiresBudget: false },
    })
    productId = product!.id
  })

  it('deve retornar carrinho vazio', async () => {
    const res = await request(app).get(CART_BASE).set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(0)
    expect(res.body.subtotal).toBe(0)
  })

  it('deve adicionar item ao carrinho', async () => {
    const res = await request(app)
      .post(CART_BASE)
      .set('Authorization', `Bearer ${token}`)
      .send({
        productId,
        quantity: 2,
        customization: {
          printOption: 'fronteVerso',
          colorHex: '#000000',
          colorName: 'Preto',
          size: 'M',
        },
      })

    expect(res.status).toBe(201)
    expect(res.body.productId).toBe(productId)
    expect(res.body.quantity).toBe(2)
  })

  it('deve rejeitar produto inexistente', async () => {
    const res = await request(app).post(CART_BASE).set('Authorization', `Bearer ${token}`).send({
      productId: '00000000-0000-0000-0000-000000000000',
      quantity: 1,
    })

    expect(res.status).toBe(404)
  })

  it('deve rejeitar sem autenticação', async () => {
    const res = await request(app).get(CART_BASE)
    expect(res.status).toBe(401)
  })
})
