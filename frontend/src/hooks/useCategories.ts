// src/hooks/useCategories.ts
import useSWR, { mutate as globalMutate } from 'swr'
import { api } from '../lib/api'

const fetcher = (url: string) => api.get(url).then(r => r.data)

export interface ApiCategory {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  _count?: { products: number }
}

export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<ApiCategory[]>(
    '/categories',
    fetcher,
    { revalidateOnFocus: false },
  )

  return {
    categories: data ?? [],
    isLoading,
    error,
    refresh: mutate,
  }
}

export async function createCategory(payload: {
  name: string
  description?: string
  imageUrl?: string
}) {
  const { data } = await api.post<ApiCategory>('/categories', payload)
  await globalMutate('/categories')
  return data
}

export async function updateCategory(
  id: string,
  payload: Partial<{ name: string; description: string; imageUrl: string }>,
) {
  const { data } = await api.patch<ApiCategory>(`/categories/${id}`, payload)
  await globalMutate('/categories')
  return data
}

export async function deleteCategory(id: string) {
  await api.delete(`/categories/${id}`)
  await globalMutate('/categories')
}
