import { sizes } from "../data";

interface SizeAndQuantitySelectorProps {
  selectedSize: string;
  quantity: number;
  onSizeChange: (size: string) => void;
  onQuantityChange: (quantity: number) => void;
}

export function SizeAndQuantitySelector({
  selectedSize,
  quantity,
  onSizeChange,
  onQuantityChange,
}: SizeAndQuantitySelectorProps) {
  return (
    <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6">
      <h3 className="text-xl font-bold text-fd-white mb-4">
        Tamanho e Quantidade
      </h3>

      <div className="mb-4">
        <label className="block text-fd-white/80 mb-2">Tamanho</label>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`px-4 py-2 rounded border-2 transition-all ${
                selectedSize === size
                  ? "border-fd-gold bg-fd-gold/20 text-fd-gold"
                  : "border-fd-gold/20 text-fd-white/70 hover:border-fd-gold/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-fd-white/80 mb-2">Quantidade</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-auto h-10 bg-fd-gold/20 hover:bg-fd-gold/30 text-fd-gold rounded transition-colors"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="flex-1 bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white text-center"
          />
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-auto h-10 bg-fd-gold/20 hover:bg-fd-gold/30 text-fd-gold rounded transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
