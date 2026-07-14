// src/context/CartContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { api } from '../lib/api'
import { useAuth } from './AuthContext'
import type { CartItem } from '../types'

interface ApiCartItem {
  id: string
  quantity: number
  unitPrice: number
  subtotal: number
  product: {
    id: string
    name: string
    priceFront: number
    priceBack: number
    priceBoth: number
    images: { url: string }[]
  }
  variant: { id: string; color: string; size: string }
  customization: { printOption: string; colorHex: string; colorName: string } | null
}

interface AddToCartPayload {
  productId: string
  variantId: string
  quantity: number
  customization?: {
    printOption: 'frente' | 'verso' | 'fronteVerso'
    colorHex: string
    colorName: string
    size: string
    artUrl?: string
  }
}

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  addItem: (payload: AddToCartPayload) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  // Para itens locais (usuário não logado) — adiciona direto no state
  addLocalItem: (item: CartItem) => void
  updateLocalQuantity: (itemId: string, quantity: number) => void
  removeLocalItem: (itemId: string) => void
}

const CartContext = createContext<CartContextType | null>(null)

function apiItemToCartItem(item: ApiCartItem): CartItem {
  return {
    id: item.id,
    product: {
      id: item.product.id,
      name: item.product.name,
      category: 'camisetas',
      description: '',
      basePrice: item.unitPrice,
      images: item.product.images.map(i => i.url),
      sizes: [item.variant.size as 'M'],
      colors: [{ name: item.variant.color, hex: item.customization?.colorHex ?? '#000000', available: true }],
      available: true,
      featured: false,
      isNew: false,
      isPremium: false,
      stockQuantity: 999,
      tags: [],
      createdAt: new Date(),
    },
    customization: {
      productId: item.product.id,
      size: item.variant.size as 'M',
      color: { name: item.variant.color, hex: item.customization?.colorHex ?? '#000000', available: true },
      quantity: item.quantity,
    },
    quantity: item.quantity,
    subtotal: item.subtotal,
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // ── Carrinho da API (usuário logado) ──────────────────────
  const addItem = useCallback(async (payload: AddToCartPayload) => {
    setIsLoading(true)
    try {
      await api.post('/cart', payload)
      const { data } = await api.get<{ items: ApiCartItem[] }>('/cart')
      setItems(data.items.map(apiItemToCartItem))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return
    setIsLoading(true)
    try {
      await api.patch(`/cart/${itemId}`, { quantity })
      setItems(prev => prev.map(i => i.id === itemId
        ? { ...i, quantity, subtotal: (i.subtotal / i.quantity) * quantity }
        : i
      ))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const removeItem = useCallback(async (itemId: string) => {
    await api.delete(`/cart/${itemId}`)
    setItems(prev => prev.filter(i => i.id !== itemId))
  }, [])

  const clearCart = useCallback(async () => {
    await api.delete('/cart')
    setItems([])
  }, [])

  // ── Carrinho local (usuário não logado) ───────────────────
  const addLocalItem = useCallback((item: CartItem) => {
    setItems(prev => [...prev, item])
  }, [])

  const updateLocalQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return
    setItems(prev => prev.map(i => i.id === itemId
      ? { ...i, quantity, subtotal: (i.subtotal / i.quantity) * quantity }
      : i
    ))
  }, [])

  const removeLocalItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(i => i.id !== itemId))
  }, [])

  return (
    <CartContext.Provider value={{
      items, isLoading,
      addItem, updateQuantity, removeItem, clearCart,
      addLocalItem, updateLocalQuantity, removeLocalItem,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider')
  return ctx
}
