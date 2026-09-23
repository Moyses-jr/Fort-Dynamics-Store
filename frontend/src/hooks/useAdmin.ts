// src/hooks/useAdmin.ts
import useSWR from 'swr'
import { api } from '../lib/api'

const fetcher = (url: string) => api.get(url).then(r => r.data)

export interface AdminStats {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  newOrdersToday: number
  revenueToday: number
  ordersByStatus: Record<string, number>
  topProducts: Array<{ productName: string; _sum: { quantity: number | null } }>
}

export interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string
  isActive: boolean
  role: 'CUSTOMER' | 'ADMIN'
  createdAt: string
  _count: { orders: number }
}

export interface AdminOrder {
  id: string
  status: string
  total: number
  createdAt: string
  user: { id: string; name: string; email: string }
  payment?: { status: string; method: string } | null
}

export function useAdminStats() {
  const { data, error, isLoading } = useSWR<AdminStats>('/stats', fetcher)
  return { stats: data, isLoading, error }
}

export function useAdminUsers() {
  const { data, error, isLoading } = useSWR<AdminUser[]>('/users', fetcher)
  return { users: data ?? [], isLoading, error }
}

export function useAdminOrders(status?: string) {
  const query = status ? `?status=${status}` : ''
  const { data, error, isLoading, mutate } = useSWR<{
    data: AdminOrder[]
    meta: { total: number }
  }>(`/orders/admin/all${query}`, fetcher)

  return { orders: data?.data ?? [], total: data?.meta.total ?? 0, isLoading, error, refresh: mutate }
}

export async function updateOrderStatus(
  id: string,
  payload: { status: string; note?: string; trackingCode?: string },
) {
  const { data } = await api.patch(`/orders/admin/${id}/status`, payload)
  return data
}