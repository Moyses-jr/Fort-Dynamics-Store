import { Upload } from "lucide-react";
import type { ViewCustomization } from "../types";

interface MockupPreviewProps {
  backgroundColor: string;
  mockupImage: string;
  mockupName: string;
  customization: ViewCustomization;
}

export function MockupPreview({
  backgroundColor,
  mockupImage,
  mockupName,
  customization,
}: MockupPreviewProps) {
  return (
    <div className="relative aspect-square bg-fd-gray/40 rounded-lg overflow-hidden border-2 border-fd-gold/30">
      {/* Background do mockup */}
      <div className="absolute inset-0" style={{ backgroundColor }}>
        <img
          src={mockupImage}
          alt={mockupName}
          className="w-full h-full object-cover mix-blend-overlay opacity-60"
        />
      </div>

      {/* Arte do usuário sobreposta */}
      {customization.image && (
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <img
            src={customization.image}
            alt="Design do usuário"
            style={{
              position: "absolute",
              maxWidth: "60%",
              maxHeight: "60%",
              objectFit: "contain",
              transform: `translate(-50%, -50%) scale(${
                customization.scale / 100
              }) rotate(${customization.rotation}deg)`,
            }}
            className="transition-transform duration-200"
          />
        </div>
      )}

      {/* Overlay de instruções se não houver imagem */}
      {!customization.image && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-fd-white/50">
            <Upload className="w-16 h-16 mx-auto mb-3" />
            <p className="text-lg">Faça upload da sua arte</p>
          </div>
        </div>
      )}
    </div>
  );
}
