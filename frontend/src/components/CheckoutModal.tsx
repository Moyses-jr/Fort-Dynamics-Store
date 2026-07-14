// src/components/CheckoutModal.tsx
import { useState } from 'react'
import { X, Loader2, MapPin, CreditCard, Smartphone, FileText, Plus, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAddresses, createAddress } from '../hooks/useUserProfile'
import { createOrder, createPixPayment } from '../hooks/useOrders'
import { useCart } from '../context/CartContext'
import type { Address } from '../types'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  subtotal: number
  shipping: number
  total: number
}

type Step = 'address' | 'payment' | 'pix_qr' | 'success'

export function CheckoutModal({ isOpen, onClose, onSuccess, subtotal, shipping, total }: CheckoutModalProps) {
  const { isLoggedIn } = useAuth()
  const { addresses, refresh: refreshAddresses } = useAddresses(isLoggedIn)
  const { clearCart } = useCart()

  const [step, setStep] = useState<Step>('address')
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'boleto'>('pix')
  const [couponCode, setCouponCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeBase64: string } | null>(null)
  const [showNewAddress, setShowNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '', isDefault: false,
  })

  if (!isOpen) return null

  const handleAddAddress = async () => {
    setIsLoading(true)
    try {
      const created = await createAddress(newAddress)
      await refreshAddresses()
      setSelectedAddressId(created.id)
      setShowNewAddress(false)
    } catch {
      setError('Erro ao salvar endereço.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { setError('Selecione um endereço.'); return }
    setIsLoading(true)
    setError(null)
    try {
      const order = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: couponCode || undefined,
      })

      if (paymentMethod === 'pix') {
        const pix = await createPixPayment(order.id)
        setPixData(pix)
        setStep('pix_qr')
      } else {
        await clearCart()
        setStep('success')
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg ?? 'Erro ao criar pedido.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePixConfirm = async () => {
    await clearCart()
    setStep('success')
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0D0D0D]">
            <h2 className="text-[#F5C542] text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {step === 'address' && 'Endereço de entrega'}
              {step === 'payment' && 'Forma de pagamento'}
              {step === 'pix_qr' && 'Pague com PIX'}
              {step === 'success' && 'Pedido realizado!'}
            </h2>
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#F5C542] hover:text-[#F5C542] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* ── STEP: ADDRESS ── */}
            {step === 'address' && (
              <>
                <div className="space-y-3">
                  {addresses.map(addr => (
                    <button key={addr.id} onClick={() => setSelectedAddressId(addr.id)}
                      className={`w-full text-left p-4 border transition-all ${selectedAddressId === addr.id ? 'border-[#F5C542] bg-[#F5C542]/10' : 'border-white/10 hover:border-white/30'}`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-white text-sm">{addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ''}</p>
                          <p className="text-white/50 text-xs mt-1">{addr.neighborhood}, {addr.city} — {addr.state}</p>
                          <p className="text-white/50 text-xs">CEP: {addr.zipCode}</p>
                        </div>
                        {selectedAddressId === addr.id && <Check className="w-5 h-5 text-[#F5C542] flex-shrink-0" />}
                      </div>
                    </button>
                  ))}
                </div>

                {!showNewAddress ? (
                  <button onClick={() => setShowNewAddress(true)}
                    className="w-full flex items-center justify-center gap-2 border border-dashed border-white/20 text-white/50 py-4 hover:border-[#F5C542] hover:text-[#F5C542] transition-colors text-sm">
                    <Plus className="w-4 h-4" /> Novo endereço
                  </button>
                ) : (
                  <div className="space-y-3 border border-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-widest text-[#D4B896]">Novo endereço</p>
                    {[
                      { key: 'zipCode', label: 'CEP', placeholder: '00000000', maxLength: 8 },
                      { key: 'street', label: 'Rua' },
                      { key: 'number', label: 'Número' },
                      { key: 'complement', label: 'Complemento (opcional)' },
                      { key: 'neighborhood', label: 'Bairro' },
                      { key: 'city', label: 'Cidade' },
                      { key: 'state', label: 'Estado (UF)', maxLength: 2 },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-[10px] uppercase tracking-widest text-white/50 block mb-1">{f.label}</label>
                        <input
                          value={(newAddress as Record<string, string>)[f.key] ?? ''}
                          onChange={e => setNewAddress(p => ({ ...p, [f.key]: e.target.value.toUpperCase() }))}
                          maxLength={f.maxLength}
                          placeholder={f.placeholder}
                          className="w-full bg-white/5 border border-white/20 text-white px-3 py-2 text-sm focus:border-[#F5C542] focus:outline-none"
                        />
                      </div>
                    ))}
                    <button onClick={handleAddAddress} disabled={isLoading}
                      className="w-full bg-[#F5C542] text-black py-2 font-bold text-sm uppercase tracking-widest hover:bg-[#E0A81F] disabled:opacity-60">
                      {isLoading ? 'Salvando...' : 'Salvar endereço'}
                    </button>
                  </div>
                )}

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button onClick={() => { setError(null); setStep('payment') }}
                  disabled={!selectedAddressId}
                  className="w-full bg-[#F5C542] text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#E0A81F] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  Continuar para pagamento
                </button>
              </>
            )}

            {/* ── STEP: PAYMENT ── */}
            {step === 'payment' && (
              <>
                <div className="space-y-3">
                  {[
                    { id: 'pix', icon: Smartphone, label: 'PIX', desc: 'Aprovação imediata — desconto de 5%' },
                    { id: 'credit_card', icon: CreditCard, label: 'Cartão de crédito', desc: 'Em até 12x' },
                    { id: 'boleto', icon: FileText, label: 'Boleto bancário', desc: 'Vencimento em 3 dias úteis' },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setPaymentMethod(opt.id as typeof paymentMethod)}
                      className={`w-full flex items-center gap-4 p-4 border transition-all ${paymentMethod === opt.id ? 'border-[#F5C542] bg-[#F5C542]/10' : 'border-white/10 hover:border-white/30'}`}>
                      <opt.icon className={`w-5 h-5 ${paymentMethod === opt.id ? 'text-[#F5C542]' : 'text-white/50'}`} />
                      <div className="text-left">
                        <p className={`text-sm font-bold ${paymentMethod === opt.id ? 'text-[#F5C542]' : 'text-white'}`}>{opt.label}</p>
                        <p className="text-xs text-white/50">{opt.desc}</p>
                      </div>
                      {paymentMethod === opt.id && <Check className="w-5 h-5 text-[#F5C542] ml-auto" />}
                    </button>
                  ))}
                </div>

                {/* Cupom */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-[#D4B896] block mb-2">Cupom de desconto</label>
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="FDSTORE10"
                    className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:border-[#F5C542] focus:outline-none text-sm" />
                </div>

                {/* Resumo */}
                <div className="bg-[#111] border border-white/10 p-4 space-y-2">
                  <div className="flex justify-between text-white/60 text-sm"><span>Subtotal</span><span>R$ {subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-white/60 text-sm"><span>Frete</span><span>{shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2)}`}</span></div>
                  <div className="flex justify-between text-[#F5C542] font-bold pt-2 border-t border-white/10">
                    <span>Total</span><span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <div className="flex gap-3">
                  <button onClick={() => setStep('address')} className="flex-1 border border-white/20 text-white/60 py-4 text-sm font-bold uppercase tracking-widest hover:border-white/50 transition-colors">
                    Voltar
                  </button>
                  <button onClick={handlePlaceOrder} disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#F5C542] text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#E0A81F] transition-all disabled:opacity-60">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Confirmar pedido
                  </button>
                </div>
              </>
            )}

            {/* ── STEP: PIX QR ── */}
            {step === 'pix_qr' && pixData && (
              <div className="text-center space-y-6">
                <p className="text-white/60 text-sm">Escaneie o QR Code ou copie o código PIX</p>
                <div className="flex justify-center">
                  <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX"
                    className="w-48 h-48 border-4 border-[#F5C542] p-2" />
                </div>
                <div className="bg-[#111] border border-white/10 p-3">
                  <p className="text-[10px] uppercase tracking-widest text-[#D4B896] mb-2">Código copia e cola</p>
                  <p className="text-white/60 text-xs break-all font-mono">{pixData.qrCode}</p>
                  <button onClick={() => navigator.clipboard.writeText(pixData.qrCode)}
                    className="mt-2 text-[#F5C542] text-xs hover:underline">Copiar código</button>
                </div>
                <p className="text-white/40 text-xs">O pedido será confirmado automaticamente após o pagamento</p>
                <button onClick={handlePixConfirm}
                  className="w-full bg-[#F5C542] text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#E0A81F] transition-all">
                  Já paguei
                </button>
              </div>
            )}

            {/* ── STEP: SUCCESS ── */}
            {step === 'success' && (
              <div className="text-center space-y-6 py-6">
                <div className="w-20 h-20 rounded-full bg-[#F5C542]/20 flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-[#F5C542]" />
                </div>
                <div>
                  <h3 className="text-[#F5C542] text-3xl mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Pedido realizado!</h3>
                  <p className="text-white/60 text-sm">Você receberá um email de confirmação em breve.</p>
                </div>
                <button onClick={() => { onSuccess(); onClose() }}
                  className="w-full bg-[#F5C542] text-black py-4 font-bold uppercase tracking-widest text-sm hover:bg-[#E0A81F] transition-all">
                  Continuar comprando
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
