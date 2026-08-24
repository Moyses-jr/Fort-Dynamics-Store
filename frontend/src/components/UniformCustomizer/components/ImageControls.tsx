import { RotateCw, ZoomIn } from "lucide-react";
import { RangeControl } from "./RangeControl";
import type { ViewCustomization } from "../types";

interface ImageControlsProps {
  customization: ViewCustomization;
  onScaleChange: (value: number) => void;
  onRotationChange: (value: number) => void;
  onRemove: () => void;
}

/** Renderizado apenas quando há uma imagem para o lado atual (frente/verso). */
export function ImageControls({
  customization,
  onScaleChange,
  onRotationChange,
  onRemove,
}: ImageControlsProps) {
  return (
    <div className="mt-4 space-y-4">
      <RangeControl
        icon={ZoomIn}
        label="Tamanho"
        value={customization.scale}
        unit="%"
        min={50}
        max={150}
        onChange={onScaleChange}
      />

      <RangeControl
        icon={RotateCw}
        label="Rotação"
        value={customization.rotation}
        unit="°"
        min={0}
        max={360}
        onChange={onRotationChange}
      />

      <button
        onClick={onRemove}
        className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
      >
        Remover Imagem
      </button>
    </div>
  );
}
