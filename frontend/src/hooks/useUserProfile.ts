// src/hooks/useUserProfile.ts
import useSWR from 'swr'
import { api } from '../lib/api'
import type { Address } from '../types'

const fetcher = (url: string) => api.get(url).then(r => r.data)

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  cpf?: string
  isAdmin: boolean
  _count: { orders: number; favorites: number; addresses: number }
}

export function useUserProfile(enabled: boolean) {
  const { data, error, isLoading, mutate } = useSWR<UserProfile>(
    enabled ? '/users/me' : null,
    fetcher,
  )
  return { profile: data, isLoading, error, refresh: mutate }
}

export function useAddresses(enabled: boolean) {
  const { data, error, isLoading, mutate } = useSWR<Address[]>(
    enabled ? '/users/me/addresses' : null,
    fetcher,
  )
  return { addresses: data ?? [], isLoading, error, refresh: mutate }
}

export function useFavorites(enabled: boolean) {
  const { data, error, isLoading, mutate } = useSWR<Array<{ productId: string }>>(
    enabled ? '/users/me/favorites' : null,
    fetcher,
  )
  return {
    favorites: (data ?? []).map(f => f.productId),
    isLoading,
    error,
    refresh: mutate,
  }
}

export async function addFavorite(productId: string) {
  await api.post(`/users/me/favorites/${productId}`)
}

export async function removeFavorite(productId: string) {
  await api.delete(`/users/me/favorites/${productId}`)
}

export async function createAddress(data: Omit<Address, 'id'>) {
  const res = await api.post<Address>('/users/me/addresses', data)
  return res.data
}

export async function deleteAddress(id: string) {
  await api.delete(`/users/me/addresses/${id}`)
}
