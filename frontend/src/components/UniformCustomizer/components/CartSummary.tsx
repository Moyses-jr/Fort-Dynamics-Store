import { ShoppingCart } from "lucide-react";
import { formatPrice } from "../utils";

interface CartSummaryProps {
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  canAddToCart: boolean;
  onAddToCart: () => void;
}

export function CartSummary({
  unitPrice,
  quantity,
  totalPrice,
  canAddToCart,
  onAddToCart,
}: CartSummaryProps) {
  return (
    <div className="bg-fd-gold/10 border border-fd-gold/30 rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-fd-white/80">Preço unitário:</span>
        <span className="text-fd-white font-semibold">
          {formatPrice(unitPrice)}
        </span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-fd-white/80">Quantidade:</span>
        <span className="text-fd-white font-semibold">{quantity}x</span>
      </div>
      <div className="border-t border-fd-gold/30 pt-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-fd-white text-lg">Total:</span>
          <span className="text-fd-gold font-bold text-2xl">
            {formatPrice(totalPrice)}
          </span>
        </div>
      </div>
      <button
        onClick={onAddToCart}
        disabled={!canAddToCart}
        className={`w-full btn-primary flex items-center justify-center gap-2 ${
          !canAddToCart ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <ShoppingCart className="w-5 h-5" />
        Adicionar ao Carrinho
      </button>
      {!canAddToCart && (
        <p className="text-fd-white/50 text-sm text-center mt-2">
          Faça upload de uma arte para continuar
        </p>
      )}
    </div>
  );
}
