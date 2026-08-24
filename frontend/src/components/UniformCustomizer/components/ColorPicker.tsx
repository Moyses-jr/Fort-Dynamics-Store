import { colors } from "../data";

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (hex: string) => void;
}

export function ColorPicker({ selectedColor, onSelect }: ColorPickerProps) {
  return (
    <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6">
      <h3 className="text-xl font-bold text-fd-white mb-4">Cor do Tecido</h3>
      <div className="grid grid-cols-5 gap-3">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onSelect(color.hex)}
            className={`aspect-square rounded-lg border-3 transition-all ${
              selectedColor === color.hex
                ? "border-fd-gold scale-110"
                : "border-fd-white/30 hover:border-fd-gold/50"
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
