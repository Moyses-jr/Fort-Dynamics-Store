import { useState } from "react";
import { Heart, ShoppingCart, Eye, Sparkles } from "lucide-react";
import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  isFavorite: boolean;
};

export function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  onToggleFavorite,
  isFavorite,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (product.images.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentImageIndex(0);
  };

  return (
    <div
      className="card-premium rounded-lg overflow-hidden group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-fd-gray">
        <img
          src={product.images[currentImageIndex]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-fd-gold text-fd-black text-xs uppercase tracking-wider">
              Novo
            </span>
          )}
          {product.isPremium && (
            <span className="px-3 py-1 bg-fd-black/80 text-fd-gold text-xs uppercase tracking-wider border border-fd-gold/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Premium
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-fd-black/60 hover:bg-fd-gold transition-colors rounded-full"
          aria-label="Favoritar"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-fd-gold text-fd-gold" : "text-fd-white"}`}
          />
        </button>

        {/* Hover Actions */}
        <div
          className={`absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-fd-black to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="flex gap-2">
            <button
              onClick={() => onQuickView(product)}
              className="flex-1 btn-secondary py-3 text-sm"
            >
              <Eye className="inline-block w-4 h-4 mr-2" />
              Ver Detalhes
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 btn-primary btn-primary-lg py-3 text-sm"
            >
              <ShoppingCart className="inline-block w-4 h-4 mr-2" />
              Adicionar
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-display text-lg text-fd-white mb-2 truncate">
          {product.name}
        </h3>

        <p className="text-sm text-fd-white/60 mb-3 line-clamp-2 h-10">
          {product.description}
        </p>

        {/* Colors */}
        <div className="flex items-center gap-2 mb-3">
          {product.colors.slice(0, 4).map((color) => (
            <div
              key={color.name}
              className="w-6 h-6 rounded-full border-2 border-fd-gray-lighter"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-xs text-fd-white/40">
              +{product.colors.length - 4}
            </span>
          )}
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-display text-fd-gold">
              R$ {product.basePrice.toFixed(2)}
            </span>
            <span className="text-xs text-fd-white/40 block">
              à vista no PIX
            </span>
          </div>

          {product.stockQuantity < 10 && (
            <span className="text-xs text-orange-400 uppercase">
              Últimas unidades!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
