// src/components/AuthModal.tsx
import { useState } from 'react'
import { X, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({ name: '', email: '', password: '' })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await register(form.name, form.email, form.password)
      }
      onClose()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Algo deu errado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4B896] mb-1">FD Store</p>
              <h2 className="text-[#F5C542] text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {mode === 'login' ? 'Entrar na conta' : 'Criar conta'}
              </h2>
            </div>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#F5C542] hover:text-[#F5C542] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#D4B896] block mb-2">Nome completo</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:border-[#F5C542] focus:outline-none transition-colors"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#D4B896] block mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:border-[#F5C542] focus:outline-none transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#D4B896] block mb-2">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 pr-12 focus:border-[#F5C542] focus:outline-none transition-colors"
                  placeholder={mode === 'register' ? 'Mínimo 8 caracteres' : '••••••••'}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-[#F5C542] text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#E0A81F] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>

            <div className="text-center text-sm text-white/50">
              {mode === 'login' ? (
                <>Não tem conta?{' '}
                  <button type="button" onClick={() => { setMode('register'); setError(null) }}
                    className="text-[#F5C542] hover:underline">Cadastre-se</button>
                </>
              ) : (
                <>Já tem conta?{' '}
                  <button type="button" onClick={() => { setMode('login'); setError(null) }}
                    className="text-[#F5C542] hover:underline">Entrar</button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
