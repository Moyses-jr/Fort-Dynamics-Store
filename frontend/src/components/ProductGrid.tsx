import { ProductCard } from './ProductCard';
import type { Product } from '../types';

type ProductGridProps = {
  title: string;
  products: Product[];
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  favorites: string[];
};

export function ProductGrid({
  title,
  products,
  onQuickView,
  onAddToCart,
  onToggleFavorite,
  favorites,
}: ProductGridProps) {
  return (
    <section className="py-20">
      <div className="container-fd">
        <div className="text-center mb-12">
          <h2 className="text-fd-white mb-4">{title}</h2>
          <div className="w-24 h-1 gold-gradient mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(product.id)}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-fd-white/40 text-lg">Nenhum produto encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
