// src/pages/App.tsx
import { useState } from 'react'
import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { CatalogoFD } from '../components/CatalogoFD'
import { UniformCustomizer } from '../components/UniformCustomizer'
import { Testimonials } from '../components/Testimonials'
import { Footer } from '../components/Footer'
import { Cart } from '../components/Cart'
import { UserProfile } from '../components/UserProfile'
import { AuthModal } from '../components/AuthModal'
import { CheckoutModal } from '../components/CheckoutModal'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { CartProvider, useCart } from '../context/CartContext'
import { useOrders } from '../hooks/useOrders'
import { useAddresses, useFavorites } from '../hooks/useUserProfile'
import { mockTestimonials } from '../utils/mockData'
import type { CartItem } from '../types'
import { resolveVariantId } from '../lib/variantResolver'

// ── Inner app (tem acesso aos contexts) ─────────────────────────────
function AppInner() {
  const { user, isLoggedIn, logout } = useAuth()
  const { items, addLocalItem, updateLocalQuantity, removeLocalItem, addItem, updateQuantity, removeItem, clearCart } = useCart()
  const { orders } = useOrders()
  const { addresses } = useAddresses(isLoggedIn)
  const { favorites } = useFavorites(isLoggedIn)

  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0)
  const shipping = subtotal > 299 ? 0 : 20
  const total = subtotal + shipping

  // ── Handlers do CatalogoFD ──────────────────────────────────────
  const handleAddToCart = async (customization: {
    product: { id: string; name: string; category: string; description: string; basePrice: number; images: string[]; available: boolean }
    printOption: 'frente' | 'verso' | 'fronteVerso'
    color: string
    colorName?: string
    size: string
    quantity: number
    subtotal: number
    variantId?: string
  }) => {
    if (isLoggedIn) {
      // Usuário logado — persiste na API, resolve variantId se necessário
      const variantId = customization.variantId
        ?? await resolveVariantId(customization.product.id, customization.colorName ?? customization.color, customization.size)
      if (!variantId) {
        // Fallback: adiciona localmente se não achar variante
        const newItem: CartItem = {
          id: `cart-${Date.now()}`,
          product: {
            id: customization.product.id, name: customization.product.name,
            category: customization.product.category as 'camisetas',
            description: customization.product.description, basePrice: customization.product.basePrice,
            images: customization.product.images, sizes: [customization.size as 'M'],
            colors: [{ name: customization.colorName ?? 'Custom', hex: customization.color, available: true }],
            available: true, featured: false, isNew: false, isPremium: false,
            stockQuantity: 999, tags: [], createdAt: new Date(),
          },
          customization: { productId: customization.product.id, size: customization.size as 'M', color: { name: customization.colorName ?? 'Custom', hex: customization.color, available: true }, quantity: customization.quantity },
          quantity: customization.quantity, subtotal: customization.subtotal,
        }
        addLocalItem(newItem)
        setIsCartOpen(true)
        return
      }
      await addItem({
        productId: customization.product.id,
        variantId,
        quantity: customization.quantity,
        customization: {
          printOption: customization.printOption,
          colorHex: customization.color,
          colorName: customization.colorName ?? 'Custom',
          size: customization.size,
        },
      })
    } else {
      // Não logado — estado local
      const newItem: CartItem = {
        id: `cart-${Date.now()}`,
        product: {
          id: customization.product.id,
          name: customization.product.name,
          category: customization.product.category as 'camisetas',
          description: customization.product.description,
          basePrice: customization.product.basePrice,
          images: customization.product.images,
          sizes: [customization.size as 'M'],
          colors: [{ name: customization.colorName ?? 'Custom', hex: customization.color, available: true }],
          available: true,
          featured: false, isNew: false, isPremium: false,
          stockQuantity: 999, tags: [], createdAt: new Date(),
        },
        customization: {
          productId: customization.product.id,
          size: customization.size as 'M',
          color: { name: customization.colorName ?? 'Custom', hex: customization.color, available: true },
          quantity: customization.quantity,
        },
        quantity: customization.quantity,
        subtotal: customization.subtotal,
      }
      addLocalItem(newItem)
    }
    setIsCartOpen(true)
  }

  const handleUpdateQuantity = (itemId: string, newQty: number) => {
    if (isLoggedIn) updateQuantity(itemId, newQty)
    else updateLocalQuantity(itemId, newQty)
  }

  const handleRemoveItem = (itemId: string) => {
    if (isLoggedIn) removeItem(itemId)
    else removeLocalItem(itemId)
  }

  const handleCheckout = () => {
    if (!isLoggedIn) { setIsCartOpen(false); setIsAuthOpen(true); return }
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const handleLoginClick = () => {
    if (isLoggedIn) setIsProfileOpen(true)
    else setIsAuthOpen(true)
  }

  const handleLogout = async () => {
    await logout()
    setIsProfileOpen(false)
  }

  // Monta o objeto user no formato esperado pelo UserProfile existente
  const profileUser = isLoggedIn && user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: '',
    cpf: undefined,
    addresses,
    orders: [],
    favorites,
    createdAt: new Date(),
  } : null

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Header
        cartItemsCount={items.length}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={handleLoginClick}
        isLoggedIn={isLoggedIn}
      />

      <Hero onCTAClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} />

      <section id="catalogo">
        <CatalogoFD onAddToCart={handleAddToCart} />
      </section>

      <section id="uniformes">
        <UniformCustomizer onAddToCart={(c: unknown) => {
          const customization = c as { mockup?: { id?: string; name?: string; price?: number; image?: string }; size: string; color: string; quantity: number; totalPrice: number }
          const newItem: CartItem = {
            id: `cart-${Date.now()}`,
            product: {
              id: customization.mockup?.id ?? 'uniforme',
              name: customization.mockup?.name ?? 'Uniforme Personalizado',
              category: 'uniformes',
              description: 'Uniforme personalizado com arte exclusiva',
              basePrice: customization.mockup?.price ?? customization.totalPrice,
              images: [customization.mockup?.image ?? ''],
              sizes: [customization.size as 'M'],
              colors: [{ name: 'Custom', hex: customization.color, available: true }],
              available: true, featured: false, isNew: false, isPremium: false,
              stockQuantity: 999, tags: ['uniforme'], createdAt: new Date(),
            },
            customization: {
              productId: customization.mockup?.id ?? 'uniforme',
              size: customization.size as 'M',
              color: { name: 'Custom', hex: customization.color, available: true },
              quantity: customization.quantity,
            },
            quantity: customization.quantity,
            subtotal: customization.totalPrice,
          }
          addLocalItem(newItem)
          setIsCartOpen(true)
        }} />
      </section>

      <Testimonials testimonials={mockTestimonials} />

      {/* CTA Final */}
      <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1580656940647-8854a00547f0?w=1920" alt="FD Store" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]" />
        </div>
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-[#F5C542]" />
            <span className="text-[#F5C542] text-[10px] uppercase tracking-[0.3em]">Fort Dynamic</span>
            <div className="w-12 h-[2px] bg-[#F5C542]" />
          </div>
          <h2 className="text-white mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}>
            PRONTO PARA VESTIR <span style={{ WebkitTextStroke: '2px #F5C542', color: 'transparent' }}>AUTORIDADE?</span>
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-10 text-sm leading-relaxed">
            Escolha entre nossa linha de moda personalizada ou crie seu uniforme exclusivo com arte própria.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => document.getElementById('uniformes')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#F5C542] text-black px-10 py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#E0A81F] hover:shadow-[0_0_30px_rgba(245,197,66,0.4)] transition-all min-w-[240px]">
              Personalizar Uniforme
            </button>
            <button onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-transparent text-white border border-white/30 px-10 py-4 font-bold uppercase tracking-widest text-sm hover:border-[#F5C542] hover:text-[#F5C542] transition-all min-w-[240px]">
              Ver Catálogo Completo
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Modais ── */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={profileUser}
        orders={orders as never[]}
        favorites={favorites}
        onLogout={handleLogout}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={() => setIsCheckoutOpen(false)}
        subtotal={subtotal}
        shipping={shipping}
        total={total}
      />
    </div>
  )
}

// ── Root com providers ────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  )
}
