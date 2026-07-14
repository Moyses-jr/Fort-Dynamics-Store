import { X } from 'lucide-react';
import type { Product } from '../types';
import { Customizer } from './Customizer';

type QuickViewProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (customization: any) => void;
  availableStamps: any[];
  availableCharacters: any[];
};

export function QuickView({
  isOpen,
  onClose,
  product,
  onAddToCart,
  availableStamps,
  availableCharacters,
}: QuickViewProps) {
  if (!isOpen || !product) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-fd-black/90 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-fd-gray z-50 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-fd-gray-lighter flex-shrink-0">
          <h2 className="text-fd-white">Personalizar Produto</h2>
          <button
            onClick={onClose}
            className="p-2 hover:text-fd-gold transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-gold p-6">
          <Customizer
            product={product}
            onAddToCart={(customization) => {
              onAddToCart(customization);
              onClose();
            }}
            availableStamps={availableStamps}
            availableCharacters={availableCharacters}
          />
        </div>
      </div>
    </>
  );
}
