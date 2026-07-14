import { X, Minus, Plus, ShoppingBag, CreditCard } from 'lucide-react';
import type { CartItem } from '../types';

type CartProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
};

export function Cart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = subtotal > 299 ? 0 : 20;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-fd-black/80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Cart Panel */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-fd-gray z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-fd-gray-lighter">
          <h2 className="text-fd-white">Carrinho</h2>
          <button
            onClick={onClose}
            className="p-2 hover:text-fd-gold transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-gold p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-20 h-20 text-fd-gold/20 mb-4" />
              <p className="text-fd-white/60 text-lg mb-2">Seu carrinho está vazio</p>
              <p className="text-fd-white/40 text-sm mb-6">
                Adicione produtos para começar a comprar
              </p>
              <button onClick={onClose} className="btn-primary">
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-fd-gray-light rounded-lg p-4 border border-fd-gray-lighter"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 bg-fd-black rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-fd-white text-sm font-display truncate">
                            {item.product.name}
                          </h4>
                          <div className="text-xs text-fd-white/60 mt-1 space-y-0.5">
                            <div>Tamanho: {item.customization.size}</div>
                            <div>Cor: {item.customization.color.name}</div>
                            {item.customization.stampId && (
                              <div className="text-fd-gold">Com estampa personalizada</div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="p-1 hover:text-red-400 transition-colors"
                          aria-label="Remover item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 border border-fd-gray-lighter hover:border-fd-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-fd-white w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 border border-fd-gray-lighter hover:border-fd-gold transition-colors flex items-center justify-center"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-fd-gold font-display text-lg">
                          R$ {item.subtotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-fd-gray-lighter p-6 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-fd-white/80">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-fd-white/80">
                <span>Frete</span>
                <span>{shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2)}`}</span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-fd-gold">
                  Parabéns! Você ganhou frete grátis!
                </p>
              )}
              {subtotal < 299 && subtotal > 0 && (
                <p className="text-xs text-fd-white/60">
                  Faltam R$ {(299 - subtotal).toFixed(2)} para frete grátis
                </p>
              )}
              <div className="pt-2 border-t border-fd-gray-lighter flex justify-between">
                <span className="font-display text-lg text-fd-white">Total</span>
                <span className="font-display text-2xl text-fd-gold">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full btn-primary py-4"
            >
              <CreditCard className="inline-block w-5 h-5 mr-2" />
              Finalizar Compra
            </button>

            <button
              onClick={onClose}
              className="w-full btn-secondary py-3 text-sm"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
