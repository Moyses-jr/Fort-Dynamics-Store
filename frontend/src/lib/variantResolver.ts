// src/lib/variantResolver.ts
// Resolve o variantId da API a partir das escolhas do usuário no CatalogoFD
import { api } from './api'

interface Variant {
  id: string
  color: string
  size: string
  stock: number
  available: boolean
}

interface ProductWithVariants {
  id: string
  variants: Variant[]
}

// Cache simples para evitar chamadas repetidas
const cache = new Map<string, Variant[]>()

export async function resolveVariantId(
  productId: string,
  color: string,
  size: string,
): Promise<string | null> {
  let variants = cache.get(productId)

  if (!variants) {
    try {
      const { data } = await api.get<ProductWithVariants>(`/products/${productId}`)
      variants = data.variants ?? []
      cache.set(productId, variants)
    } catch {
      return null
    }
  }

  // Tenta match exato de cor e tamanho
  const exact = variants.find(
    v => v.available && v.stock > 0 &&
      v.size.toUpperCase() === size.toUpperCase() &&
      v.color.toLowerCase().includes(color.toLowerCase().split(' ')[0]),
  )
  if (exact) return exact.id

  // Fallback: qualquer variante disponível com o tamanho
  const bySize = variants.find(v => v.available && v.stock > 0 && v.size.toUpperCase() === size.toUpperCase())
  if (bySize) return bySize.id

  // Último fallback: primeira variante disponível
  const first = variants.find(v => v.available && v.stock > 0)
  return first?.id ?? null
}
