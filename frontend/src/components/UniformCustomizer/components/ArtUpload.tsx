import { useRef } from "react";
import { Upload } from "lucide-react";
import { uploadTargets } from "../data";
import type { ViewSide } from "../types";

interface ArtUploadProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>, view: ViewSide) => void;
}

export function ArtUpload({ onUpload }: ArtUploadProps) {
  const fileInputRefs = {
    frente: useRef<HTMLInputElement>(null),
    verso: useRef<HTMLInputElement>(null),
  };

  return (
    <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6">
      <h3 className="text-xl font-bold text-fd-white mb-4">
        Upload da Arte
      </h3>
      <input
        ref={fileInputRefs.frente}
        type="file"
        accept="image/*"
        onChange={(e) => onUpload(e, "frente")}
        className="hidden"
      />
      <input
        ref={fileInputRefs.verso}
        type="file"
        accept="image/*"
        onChange={(e) => onUpload(e, "verso")}
        className="hidden"
      />
      <div className="flex flex-col gap-2">
        {uploadTargets.map(({ view, label }) => (
          <button
            key={view}
            onClick={() => fileInputRefs[view].current?.click()}
            className="w-full py-4 border-2 border-dashed border-fd-gold/30 rounded-lg hover:border-fd-gold hover:bg-fd-gold/5 transition-all flex flex-col items-center gap-2 text-fd-white/80"
          >
            <Upload className="w-8 h-8" />
            <span>Clique para fazer upload ({label})</span>
            <span className="text-xs text-fd-white/50">PNG, JPG ou SVG</span>
          </button>
        ))}
      </div>
    </div>
  );
}
