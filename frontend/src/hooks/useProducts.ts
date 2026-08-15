// src/hooks/useProducts.ts
import useSWR, { mutate as globalMutate } from 'swr'
import { api } from '../lib/api'

const fetcher = (url: string) => api.get(url).then(r => r.data)

export interface ApiProduct {
  id: string
  name: string
  description: string
  fabricType: string
  priceFront: number
  priceBack: number
  priceBoth: number
  requiresBudget: boolean
  available: boolean
  badge: string | null
  obs: string | null
  isFeatured: boolean
  isNew: boolean
  isPremium: boolean
  category: { id: string; name: string; slug: string }
  images: { url: string; isPrimary: boolean }[]
  colors: { id: string; name: string; hex: string; available: boolean }[]
  sizes: { id: string; size: string }[]
  variants?: { id: string; color: string; size: string; stock: number; available: boolean }[]
}

export function useProducts(params?: {
  category?: string
  search?: string
  featured?: boolean
  available?: boolean
  limit?: number
}) {
  const query = new URLSearchParams()
  if (params?.category) query.set('category', params.category)
  if (params?.search) query.set('search', params.search)
  if (params?.featured) query.set('featured', 'true')
  if (params?.available !== undefined) query.set('available', String(params.available))
  if (params?.limit) query.set('limit', String(params.limit))

  const { data, error, isLoading } = useSWR<{ data: ApiProduct[]; meta: { total: number } }>(
    `/products?${query.toString()}`,
    fetcher,
    { revalidateOnFocus: false },
  )

  return {
    products: data?.data ?? [],
    total: data?.meta.total ?? 0,
    isLoading,
    error,
  }
}

export function useProduct(id: string) {
  const { data, error, isLoading } = useSWR<ApiProduct>(
    id ? `/products/${id}` : null,
    fetcher,
  )
  return { product: data, isLoading, error }
}

export function useFeaturedProducts() {
  const { data, error, isLoading } = useSWR<ApiProduct[]>('/products/featured', fetcher, {
    revalidateOnFocus: false,
  })
  return { products: data ?? [], isLoading, error }
}

// ── Mutações admin ────────────────────────────────────────
// Revalida todas as listagens de produtos em cache após criar/editar/excluir
function revalidateProducts() {
  return globalMutate(
    (key: unknown) => typeof key === 'string' && key.startsWith('/products'),
    undefined,
    { revalidate: true },
  )
}

export interface CreateProductPayload {
  categoryId: string
  name: string
  description: string
  fabricType: string
  priceFront: number
  priceBack: number
  priceBoth: number
  requiresBudget?: boolean
  available?: boolean
  badge?: string
  obs?: string
  isFeatured?: boolean
  isNew?: boolean
  isPremium?: boolean
  images: Array<{ url: string; isPrimary: boolean; order: number }>
  variants: Array<{
    variantId: string
    color: string
    size: string
    stock: number
    available?: boolean
  }>
}

export async function createProduct(payload: CreateProductPayload) {
  const { data } = await api.post<ApiProduct>('/products', payload)
  await revalidateProducts()
  return data
}

export async function updateProduct(id: string, payload: Partial<CreateProductPayload>) {
  const { data } = await api.patch<ApiProduct>(`/products/${id}`, payload)
  await revalidateProducts()
  return data
}

export async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`)
  await revalidateProducts()
}
