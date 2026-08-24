import type { LucideIcon } from "lucide-react";

interface RangeControlProps {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function RangeControl({
  icon: Icon,
  label,
  value,
  unit,
  min,
  max,
  onChange,
}: RangeControlProps) {
  return (
    <div>
      <label className="block text-fd-white/80 mb-2 text-sm flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}: {value}
        {unit}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-fd-gold"
      />
    </div>
  );
}
