import { formatPrice } from "../utils";
import type { MockupTemplate } from "../types";

interface MockupSelectorProps {
  mockups: MockupTemplate[];
  selectedMockupId: string;
  onSelect: (mockup: MockupTemplate) => void;
}

export function MockupSelector({
  mockups,
  selectedMockupId,
  onSelect,
}: MockupSelectorProps) {
  return (
    <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6">
      <h3 className="text-xl font-bold text-fd-white mb-4">
        Escolha o Modelo
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {mockups.map((mockup) => (
          <button
            key={mockup.id}
            onClick={() => onSelect(mockup)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedMockupId === mockup.id
                ? "border-fd-gold bg-fd-gold/10"
                : "border-fd-gold/20 hover:border-fd-gold/50"
            }`}
          >
            <div className="aspect-square bg-fd-gray/40 rounded mb-2 overflow-hidden">
              <img
                src={mockup.imageFront}
                alt={mockup.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-fd-white text-xs text-center">
              {mockup.name}
            </p>
            <p className="text-fd-gold text-xs text-center font-bold">
              {formatPrice(mockup.price)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
