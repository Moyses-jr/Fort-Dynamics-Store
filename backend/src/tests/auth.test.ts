// src/tests/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { prisma } from '../config/database'

const BASE = '/api/v1/auth'

describe('Auth', () => {
  const userPayload = {
    name: 'Teste User',
    email: `test.${Date.now()}@fdstore.com`,
    password: 'senha12345',
  }

  describe('POST /register', () => {
    it('deve registrar um novo usuário', async () => {
      const res = await request(app).post(`${BASE}/register`).send(userPayload)

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('accessToken')
      expect(res.body.user.email).toBe(userPayload.email)
      expect(res.body.user).not.toHaveProperty('passwordHash')
    })

    it('deve rejeitar email duplicado', async () => {
      await request(app).post(`${BASE}/register`).send(userPayload)
      const res = await request(app).post(`${BASE}/register`).send(userPayload)

      expect(res.status).toBe(409)
      expect(res.body.code).toBe('CONFLICT')
    })

    it('deve rejeitar senha fraca', async () => {
      const res = await request(app)
        .post(`${BASE}/register`)
        .send({ ...userPayload, email: 'other@test.com', password: '123' })

      expect(res.status).toBe(422)
    })
  })

  describe('POST /login', () => {
    beforeEach(async () => {
      await request(app).post(`${BASE}/register`).send(userPayload)
    })

    it('deve autenticar com credenciais corretas', async () => {
      const res = await request(app)
        .post(`${BASE}/login`)
        .send({ email: userPayload.email, password: userPayload.password })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('accessToken')
      expect(res.headers['set-cookie']).toBeDefined()
    })

    it('deve rejeitar senha incorreta', async () => {
      const res = await request(app)
        .post(`${BASE}/login`)
        .send({ email: userPayload.email, password: 'senhaerrada' })

      expect(res.status).toBe(401)
    })
  })

  describe('POST /logout', () => {
    it('deve deslogar e invalidar o token', async () => {
      const reg = await request(app)
        .post(`${BASE}/register`)
        .send({
          ...userPayload,
          email: `logout.${Date.now()}@test.com`,
        })
      const { accessToken } = reg.body as { accessToken: string }

      const logout = await request(app)
        .post(`${BASE}/logout`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(logout.status).toBe(204)

      // Token deve estar inválido após logout
      const me = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(me.status).toBe(401)
    })
  })
})
