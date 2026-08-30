import { useState } from "react";
import { Upload, Wand2, Loader2, Download } from "lucide-react";
import type {
  Product,
  ProductSize,
  ProductColor,
  Stamp,
  AICharacter,
} from "../types";
import {
  generateStampWithAI,
  generateCharacterWithAI,
  generate3DPreview,
} from "../utils/aiEngine";

type CustomizerProps = {
  product: Product;
  onAddToCart: (customization: any) => void;
  availableStamps: Stamp[];
  availableCharacters: AICharacter[];
};

export function Customizer({
  product,
  onAddToCart,
  availableStamps,
  availableCharacters,
}: CustomizerProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes[0],
  );
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0],
  );
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);
  const [selectedCharacter, setSelectedCharacter] =
    useState<AICharacter | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customStampMode, setCustomStampMode] = useState<
    "none" | "upload" | "ai"
  >("none");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview3D, setPreview3D] = useState<string | null>(null);
  const [isGenerating3D, setIsGenerating3D] = useState(false);

  const handleGenerateStamp = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    try {
      const newStamp = await generateStampWithAI(aiPrompt);
      setSelectedStamp(newStamp);
      setCustomStampMode("none");
      setAiPrompt("");
    } catch (error) {
      console.error("Erro ao gerar estampa:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate3D = async () => {
    setIsGenerating3D(true);
    try {
      const preview = await generate3DPreview(
        product.id,
        selectedColor.hex,
        selectedStamp?.id,
      );
      setPreview3D(preview);
    } catch (error) {
      console.error("Erro ao gerar prévia 3D:", error);
    } finally {
      setIsGenerating3D(false);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      product,
      size: selectedSize,
      color: selectedColor,
      stamp: selectedStamp,
      character: selectedCharacter,
      quantity,
    });
  };

  const calculateTotal = () => {
    let total = product.basePrice * quantity;
    if (selectedStamp?.aiGenerated) total += 30; // Taxa de estampa personalizada
    if (selectedCharacter) total += 20; // Taxa de personagem
    return total;
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Preview Area */}
      <div className="space-y-4">
        <div className="aspect-square bg-fd-gray rounded-lg overflow-hidden relative">
          <img
            src={preview3D || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />

          {selectedStamp && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={selectedStamp.imageUrl}
                alt={selectedStamp.name}
                className="w-1/2 h-1/2 object-contain opacity-80"
              />
            </div>
          )}

          {isGenerating3D && (
            <div className="absolute inset-0 bg-fd-black/80 flex items-center justify-center">
              <Loader2 className="w-12 h-12 text-fd-gold animate-spin" />
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate3D}
          disabled={isGenerating3D}
          className="w-full btn-secondary py-3"
        >
          {isGenerating3D ? (
            <>
              <Loader2 className="inline-block w-5 h-5 mr-2 animate-spin" />
              Gerando Prévia 3D...
            </>
          ) : (
            <>
              <Wand2 className="inline-block w-5 h-5 mr-2" />
              Gerar Prévia 3D
            </>
          )}
        </button>
      </div>

      {/* Customization Options */}
      <div className="space-y-6">
        <div>
          <h3 className="text-fd-white mb-4">{product.name}</h3>
          <p className="text-fd-white/60 mb-4">{product.description}</p>
          <div className="text-3xl font-display text-fd-gold">
            R$ {calculateTotal().toFixed(2)}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <label className="block text-sm uppercase tracking-wider text-fd-white/80 mb-3">
            Tamanho
          </label>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-3 border-2 transition-all ${
                  selectedSize === size
                    ? "border-fd-gold bg-fd-gold text-fd-black"
                    : "border-fd-gray-lighter text-fd-white hover:border-fd-gold"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm uppercase tracking-wider text-fd-white/80 mb-3">
            Cor: {selectedColor.name}
          </label>
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color)}
                disabled={!color.available}
                className={`w-12 h-12 rounded-full border-4 transition-all ${
                  selectedColor.name === color.name
                    ? "border-fd-gold scale-110"
                    : "border-fd-gray-lighter hover:border-fd-gold/50"
                } ${!color.available ? "opacity-30 cursor-not-allowed" : ""}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Stamp Selection */}
        <div>
          <label className="block text-sm uppercase tracking-wider text-fd-white/80 mb-3">
            Estampa
          </label>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setCustomStampMode("none")}
              className={`flex-1 py-2 text-sm border ${
                customStampMode === "none"
                  ? "border-fd-gold bg-fd-gold/10 text-fd-gold"
                  : "border-fd-gray-lighter text-fd-white"
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => setCustomStampMode("upload")}
              className={`flex-1 py-2 text-sm border ${
                customStampMode === "upload"
                  ? "border-fd-gold bg-fd-gold/10 text-fd-gold"
                  : "border-fd-gray-lighter text-fd-white"
              }`}
            >
              <Upload className="inline-block w-4 h-4 mr-1" />
              Upload
            </button>
            <button
              onClick={() => setCustomStampMode("ai")}
              className={`flex-1 py-2 text-sm border ${
                customStampMode === "ai"
                  ? "border-fd-gold bg-fd-gold/10 text-fd-gold"
                  : "border-fd-gray-lighter text-fd-white"
              }`}
            >
              <Wand2 className="inline-block w-4 h-4 mr-1" />
              IA
            </button>
          </div>

          {customStampMode === "none" && (
            <div className="grid grid-cols-4 gap-2">
              {availableStamps.map((stamp) => (
                <button
                  key={stamp.id}
                  onClick={() => setSelectedStamp(stamp)}
                  className={`aspect-square border-2 rounded overflow-hidden transition-all ${
                    selectedStamp?.id === stamp.id
                      ? "border-fd-gold"
                      : "border-fd-gray-lighter hover:border-fd-gold/50"
                  }`}
                >
                  <img
                    src={stamp.imageUrl}
                    alt={stamp.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {customStampMode === "upload" && (
            <div className="border-2 border-dashed border-fd-gray-lighter rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-fd-gold mx-auto mb-4" />
              <p className="text-fd-white/60 mb-2">Arraste sua imagem aqui</p>
              <button className="btn-primary btn-primary-lg py-2 px-6 text-sm">
                Selecionar Arquivo
              </button>
            </div>
          )}

          {customStampMode === "ai" && (
            <div className="space-y-3">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Descreva a estampa que você quer criar... Ex: leão dourado com coroa, estilo minimalista"
                className="w-full bg-fd-gray border border-fd-gray-lighter rounded px-4 py-3 text-fd-white placeholder:text-fd-white/40 focus:outline-none focus:border-fd-gold min-h-[100px]"
              />
              <button
                onClick={handleGenerateStamp}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full btn-primary btn-primary-lg py-3"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="inline-block w-5 h-5 mr-2 animate-spin" />
                    Gerando Estampa...
                  </>
                ) : (
                  <>
                    <Wand2 className="inline-block w-5 h-5 mr-2" />
                    Gerar com IA
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Character Selection */}
        <div>
          <label className="block text-sm uppercase tracking-wider text-fd-white/80 mb-3">
            Personagem (Opcional)
          </label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setSelectedCharacter(null)}
              className={`aspect-square border-2 rounded flex items-center justify-center transition-all ${
                !selectedCharacter
                  ? "border-fd-gold bg-fd-gold/10"
                  : "border-fd-gray-lighter hover:border-fd-gold/50"
              }`}
            >
              <span className="text-xs text-fd-white/60">Nenhum</span>
            </button>
            {availableCharacters.slice(0, 3).map((character) => (
              <button
                key={character.id}
                onClick={() => setSelectedCharacter(character)}
                className={`aspect-square border-2 rounded overflow-hidden transition-all ${
                  selectedCharacter?.id === character.id
                    ? "border-fd-gold"
                    : "border-fd-gray-lighter hover:border-fd-gold/50"
                }`}
              >
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm uppercase tracking-wider text-fd-white/80 mb-3">
            Quantidade
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 border-2 border-fd-gray-lighter hover:border-fd-gold transition-colors"
            >
              -
            </button>
            <span className="text-2xl font-display text-fd-white min-w-[60px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 border-2 border-fd-gray-lighter hover:border-fd-gold transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="w-full btn-primary btn-primary-lg py-4 text-lg"
        >
          Adicionar ao Carrinho - R$ {calculateTotal().toFixed(2)}
        </button>
      </div>
    </div>
  );
}
