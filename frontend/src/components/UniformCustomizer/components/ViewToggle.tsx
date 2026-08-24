import { Eye } from "lucide-react";
import { viewOptions } from "../data";
import type { ViewCustomization, ViewSide } from "../types";

interface ViewToggleProps {
  currentView: ViewSide;
  customizations: Record<ViewSide, ViewCustomization>;
  onSelect: (view: ViewSide) => void;
}

export function ViewToggle({
  currentView,
  customizations,
  onSelect,
}: ViewToggleProps) {
  return (
    <div className="flex gap-2 mb-4">
      {viewOptions.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onSelect(value)}
          className={`flex-1 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
            currentView === value
              ? "border-fd-gold bg-fd-gold/20 text-fd-gold"
              : "border-fd-gold/20 text-fd-white/70 hover:border-fd-gold/50"
          }`}
        >
          <Eye className="w-4 h-4" />
          {label}
          {customizations[value].image && (
            <span className="text-xs">(✓)</span>
          )}
        </button>
      ))}
    </div>
  );
}
