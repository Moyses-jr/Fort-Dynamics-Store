// src/hooks/useOrders.ts
import useSWR from 'swr'
import { api } from '../lib/api'
import type { Order, Address } from '../types'

const fetcher = (url: string) => api.get(url).then(r => r.data)

interface ApiOrder {
  id: string
  status: Order['status']
  paymentMethod: string
  paymentStatus: string
  total: number
  shippingCost: number
  trackingCode?: string
  createdAt: string
  updatedAt: string
  items: Array<{ productName: string; quantity: number; unitPrice: number; productImage?: string; color: string; size: string }>
  address?: Address
}

export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR<{ data: ApiOrder[] }>(
    '/orders',
    fetcher,
    { revalidateOnFocus: false },
  )

  return {
    orders: (data?.data ?? []).map(o => ({
      ...o,
      createdAt: new Date(o.createdAt),
      updatedAt: new Date(o.updatedAt),
    })),
    isLoading,
    error,
    refresh: mutate,
  }
}

export async function createOrder(payload: {
  addressId: string
  paymentMethod: 'pix' | 'credit_card' | 'boleto'
  couponCode?: string
}) {
  const { data } = await api.post<ApiOrder>('/orders', payload)
  return data
}

export async function createPixPayment(orderId: string) {
  const { data } = await api.post<{
    qrCode: string
    qrCodeBase64: string
    expiresAt: string
  }>(`/payments/pix/${orderId}`)
  return data
}
