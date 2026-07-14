// src/lib/api.ts
// Cliente Axios centralizado — todas as chamadas à API passam por aqui

import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1',
  withCredentials: true, // necessário para enviar o cookie do refresh token
  headers: { 'Content-Type': 'application/json' },
})

// ── Injeta o access token em todo request ────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Refresh token automático quando receber 401 ──────────
let isRefreshing = false
let queue: Array<(token: string) => void> = []

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      if (isRefreshing) {
        return new Promise(resolve => {
          queue.push(token => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(api(original))
          })
        })
      }

      isRefreshing = true
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL ?? 'http://localhost:3333/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true },
        )
        const newToken = (data as { accessToken: string }).accessToken
        localStorage.setItem('access_token', newToken)
        queue.forEach(cb => cb(newToken))
        queue = []
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        localStorage.removeItem('access_token')
        queue = []
        window.dispatchEvent(new Event('auth:logout'))
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
