import { useState } from "react";
import { ChevronDown, ChevronUp, Star } from "lucide-react";

export default function CatalogImageGuide() {
  const [showGuia, setShowGuia] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowGuia(!showGuia)}
        className="mt-4 inline-flex items-center gap-2 text-xs text-[#D4B896] border border-[#D4B896]/30 px-4 py-2 hover:border-[#F5C542] hover:text-[#F5C542] transition-colors"
      >
        <Star className="w-3.5 h-3.5" />
        Como adicionar imagens reais dos produtos
        {showGuia ? (
          <ChevronUp className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </button>

      {showGuia && (
        <div className="mt-4 bg-[#111] border border-[#F5C542]/20 p-6 max-w-3xl">
          <h4
            className="text-[#F5C542] mb-4 text-base"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.3rem",
            }}
          >
            📸 GUIA: Como Adicionar Suas Fotos Reais
          </h4>
          <div className="space-y-4 text-sm text-white/70">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#F5C542] text-black font-bold text-xs flex items-center justify-center">
                1
              </span>
              <div>
                <p className="text-white font-semibold mb-1">
                  Hospede sua foto gratuitamente
                </p>
                <p>
                  Acesse <span className="text-[#F5C542]">imgur.com</span> →
                  "New post" → arraste sua foto → copie o link direto da imagem
                  (clique com botão direito → "Copiar endereço da imagem").
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#F5C542] text-black font-bold text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <p className="text-white font-semibold mb-1">
                  Abra o arquivo do catálogo
                </p>
                <p>
                  No editor, abra o arquivo{" "}
                  <span className="text-[#F5C542]">/data/catalogoFD.ts</span> —
                  cada produto tem um campo{" "}
                  <span className="text-[#F5C542]">image:</span> com o link
                  atual.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#F5C542] text-black font-bold text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <p className="text-white font-semibold mb-1">
                  Substitua o link
                </p>
                <p>
                  Encontre o produto que quer atualizar (ex:{" "}
                  <span className="text-[#F5C542]">id: 'cam-001'</span> =
                  Camiseta Básica) e troque o link antigo pelo seu link novo:
                </p>
                <div className="bg-[#1a1a1a] border border-white/10 p-3 mt-2 font-mono text-xs">
                  <p className="text-white/40">{"// antes:"}</p>
                  <p className="text-red-400">
                    {"image: 'https://images.unsplash.com/...',"}
                  </p>
                  <p className="text-white/40 mt-1">
                    {"// depois (seu link):"}
                  </p>
                  <p className="text-green-400">
                    {"image: 'https://i.imgur.com/SuaFoto.jpg',"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#F5C542] text-black font-bold text-xs flex items-center justify-center">
                4
              </span>
              <div>
                <p className="text-white font-semibold mb-1">
                  Tamanho recomendado de imagem
                </p>
                <p>
                  Fotos quadradas (1:1) ou landscape (4:3) com no mínimo{" "}
                  <span className="text-[#F5C542]">800×600px</span>. Fundo
                  neutro (branco ou preto) fica mais elegante no layout.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
