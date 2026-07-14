import { useState, useRef } from "react";
import {
  Upload,
  RotateCw,
  ZoomIn,
  Download,
  ShoppingCart,
  Eye,
} from "lucide-react";

type MockupType = "camiseta" | "moletom" | "polo";
type ViewSide = "frente" | "verso";

interface MockupTemplate {
  id: string;
  name: string;
  type: MockupType;
  imageFront: string;
  imageBack: string;
  price: number;
}

const mockupTemplates: MockupTemplate[] = [
  {
    id: "mockup-001",
    name: "Camiseta Básica Lisa",
    type: "camiseta",
    imageFront:
      "https://images.unsplash.com/photo-1655141559812-42f8c1e8942d?w=800",
    imageBack:
      "https://images.unsplash.com/photo-1655141559812-42f8c1e8942d?w=800&flip=h",
    price: 89.9,
  },
  {
    id: "mockup-002",
    name: "Moletom Liso",
    type: "moletom",
    imageFront:
      "https://images.unsplash.com/photo-1759972524936-26c44fb258ca?w=800",
    imageBack:
      "https://images.unsplash.com/photo-1759972524936-26c44fb258ca?w=800&flip=h",
    price: 179.9,
  },
  {
    id: "mockup-003",
    name: "Polo Lisa",
    type: "polo",
    imageFront:
      "https://images.unsplash.com/photo-1655141559812-42f8c1e8942d?w=800",
    imageBack:
      "https://images.unsplash.com/photo-1655141559812-42f8c1e8942d?w=800&flip=h",
    price: 129.9,
  },
];

interface UniformCustomizerProps {
  onAddToCart?: (customization: any) => void;
}

export function UniformCustomizer({ onAddToCart }: UniformCustomizerProps) {
  const [selectedMockup, setSelectedMockup] = useState<MockupTemplate>(
    mockupTemplates[0]
  );
  const [currentView, setCurrentView] = useState<ViewSide>("frente");

  // Estados separados para frente e verso
  const [uploadedImageFront, setUploadedImageFront] = useState<string | null>(
    null
  );
  const [uploadedImageBack, setUploadedImageBack] = useState<string | null>(
    null
  );

  const [imageScaleFront, setImageScaleFront] = useState(100);
  const [imageScaleBack, setImageScaleBack] = useState(100);

  const [imageRotationFront, setImageRotationFront] = useState(0);
  const [imageRotationBack, setImageRotationBack] = useState(0);

  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);

  const colors = [
    { name: "Preto", hex: "#000000" },
    { name: "Branco", hex: "#ffffff" },
    { name: "Cinza", hex: "#808080" },
    { name: "Azul Marinho", hex: "#001f3f" },
    { name: "Verde Musgo", hex: "#4a5d23" },
  ];

  const sizes = ["PP", "P", "M", "G", "GG", "XG", "XXG"];

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    isFront: boolean
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isFront) {
          setUploadedImageFront(e.target?.result as string);
        } else {
          setUploadedImageBack(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddToCart = () => {
    const customization = {
      mockup: selectedMockup,
      uploadedDesignFront: uploadedImageFront,
      uploadedDesignBack: uploadedImageBack,
      color: selectedColor,
      size: selectedSize,
      quantity,
      scaleFront: imageScaleFront,
      scaleBack: imageScaleBack,
      rotationFront: imageRotationFront,
      rotationBack: imageRotationBack,
      totalPrice: selectedMockup.price * quantity,
    };

    if (onAddToCart) {
      onAddToCart(customization);
    } else {
      alert(
        `Uniforme personalizado adicionado ao carrinho!\n\nPreço total: R$ ${(
          selectedMockup.price * quantity
        ).toFixed(2)}`
      );
    }
  };

  const handleDownloadMockup = () => {
    alert("Em produção, aqui você poderia baixar o mockup em alta resolução!");
  };

  return (
    <div className="min-h-screen bg-fd-black py-16">
      <div className="container-fd">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-fd-white mb-4">
            UNIFORMES <span className="text-gold-gradient">PERSONALIZADOS</span>
          </h2>
          <p className="text-xl text-fd-white/80 max-w-3xl mx-auto">
            Faça upload da sua arte e visualize em tempo real no mockup do
            produto. Perfeito para uniformes corporativos, equipes e eventos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Preview Area */}
          <div className="space-y-6">
            <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-fd-white mb-4">
                Preview do Uniforme
              </h3>

              {/* Toggle Frente/Verso */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setCurrentView("frente")}
                  className={`flex-1 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    currentView === "frente"
                      ? "border-fd-gold bg-fd-gold/20 text-fd-gold"
                      : "border-fd-gold/20 text-fd-white/70 hover:border-fd-gold/50"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  FRENTE
                  {uploadedImageFront && <span className="text-xs">(✓)</span>}
                </button>
                <button
                  onClick={() => setCurrentView("verso")}
                  className={`flex-1 py-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
                    currentView === "verso"
                      ? "border-fd-gold bg-fd-gold/20 text-fd-gold"
                      : "border-fd-gold/20 text-fd-white/70 hover:border-fd-gold/50"
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  VERSO
                  {uploadedImageBack && <span className="text-xs">(✓)</span>}
                </button>
              </div>

              {/* Mockup Preview */}
              <div className="relative aspect-square bg-fd-gray/40 rounded-lg overflow-hidden border-2 border-fd-gold/30">
                {/* Background do mockup */}
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: selectedColor }}
                >
                  <img
                    src={
                      currentView === "frente"
                        ? selectedMockup.imageFront
                        : selectedMockup.imageBack
                    }
                    alt={selectedMockup.name}
                    className="w-full h-full object-cover mix-blend-overlay opacity-60"
                  />
                </div>

                {/* Arte do usuário sobreposta */}
                {(currentView === "frente"
                  ? uploadedImageFront
                  : uploadedImageBack) && (
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <img
                      src={
                        currentView === "frente"
                          ? uploadedImageFront
                          : uploadedImageBack
                      }
                      alt="Design do usuário"
                      style={{
                        position: "absolute",
                        maxWidth: "60%",
                        maxHeight: "60%",
                        objectFit: "contain",
                        transform: `translate(-50%, -50%) scale(${
                          currentView === "frente"
                            ? imageScaleFront / 100
                            : imageScaleBack / 100
                        }) rotate(${
                          currentView === "frente"
                            ? imageRotationFront
                            : imageRotationBack
                        }deg)`,
                      }}
                      className="transition-transform duration-200"
                    />
                  </div>
                )}

                {/* Overlay de instruções se não houver imagem */}
                {!(currentView === "frente"
                  ? uploadedImageFront
                  : uploadedImageBack) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-fd-white/50">
                      <Upload className="w-16 h-16 mx-auto mb-3" />
                      <p className="text-lg">Faça upload da sua arte</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controles da imagem */}
              {(currentView === "frente"
                ? uploadedImageFront
                : uploadedImageBack) && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-fd-white/80 mb-2 text-sm flex items-center gap-2">
                      <ZoomIn className="w-4 h-4" />
                      Tamanho:{" "}
                      {currentView === "frente"
                        ? imageScaleFront
                        : imageScaleBack}
                      %
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={
                        currentView === "frente"
                          ? imageScaleFront
                          : imageScaleBack
                      }
                      onChange={(e) => {
                        if (currentView === "frente") {
                          setImageScaleFront(parseInt(e.target.value));
                        } else {
                          setImageScaleBack(parseInt(e.target.value));
                        }
                      }}
                      className="w-full accent-fd-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-fd-white/80 mb-2 text-sm flex items-center gap-2">
                      <RotateCw className="w-4 h-4" />
                      Rotação:{" "}
                      {currentView === "frente"
                        ? imageRotationFront
                        : imageRotationBack}
                      °
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={
                        currentView === "frente"
                          ? imageRotationFront
                          : imageRotationBack
                      }
                      onChange={(e) => {
                        if (currentView === "frente") {
                          setImageRotationFront(parseInt(e.target.value));
                        } else {
                          setImageRotationBack(parseInt(e.target.value));
                        }
                      }}
                      className="w-full accent-fd-gold"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (currentView === "frente") {
                        setUploadedImageFront(null);
                      } else {
                        setUploadedImageBack(null);
                      }
                    }}
                    className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                  >
                    Remover Imagem
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleDownloadMockup}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Baixar Mockup em Alta Resolução
            </button>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Seleção de Mockup */}
            <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-fd-white mb-4">
                Escolha o Modelo
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {mockupTemplates.map((mockup) => (
                  <button
                    key={mockup.id}
                    onClick={() => setSelectedMockup(mockup)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedMockup.id === mockup.id
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
                      R$ {mockup.price.toFixed(2)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload de Arte */}
            <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-fd-white mb-4">
                Upload da Arte
              </h3>
              <input
                ref={fileInputFrontRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
              />
              <input
                ref={fileInputBackRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, false)}
                className="hidden"
              />
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => fileInputFrontRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-fd-gold/30 rounded-lg hover:border-fd-gold hover:bg-fd-gold/5 transition-all flex flex-col items-center gap-2 text-fd-white/80"
                >
                  <Upload className="w-8 h-8" />
                  <span>Clique para fazer upload (Frente)</span>
                  <span className="text-xs text-fd-white/50">
                    PNG, JPG ou SVG
                  </span>
                </button>
                <button
                  onClick={() => fileInputBackRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-fd-gold/30 rounded-lg hover:border-fd-gold hover:bg-fd-gold/5 transition-all flex flex-col items-center gap-2 text-fd-white/80"
                >
                  <Upload className="w-8 h-8" />
                  <span>Clique para fazer upload (Verso)</span>
                  <span className="text-xs text-fd-white/50">
                    PNG, JPG ou SVG
                  </span>
                </button>
              </div>
            </div>

            {/* Seleção de Cor */}
            <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-fd-white mb-4">
                Cor do Tecido
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
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

            {/* Tamanho e Quantidade */}
            <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-fd-white mb-4">
                Tamanho e Quantidade
              </h3>

              <div className="mb-4">
                <label className="block text-fd-white/80 mb-2">Tamanho</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border-2 transition-all ${
                        selectedSize === size
                          ? "border-fd-gold bg-fd-gold/20 text-fd-gold"
                          : "border-fd-gold/20 text-fd-white/70 hover:border-fd-gold/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-fd-white/80 mb-2">
                  Quantidade
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-fd-gold/20 hover:bg-fd-gold/30 text-fd-gold rounded transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="flex-1 bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white text-center"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-fd-gold/20 hover:bg-fd-gold/30 text-fd-gold rounded transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Resumo e Adicionar ao Carrinho */}
            <div className="bg-fd-gold/10 border border-fd-gold/30 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-fd-white/80">Preço unitário:</span>
                <span className="text-fd-white font-semibold">
                  R$ {selectedMockup.price.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-fd-white/80">Quantidade:</span>
                <span className="text-fd-white font-semibold">{quantity}x</span>
              </div>
              <div className="border-t border-fd-gold/30 pt-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-fd-white text-lg">Total:</span>
                  <span className="text-fd-gold font-bold text-2xl">
                    R$ {(selectedMockup.price * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!uploadedImageFront}
                className={`w-full btn-primary flex items-center justify-center gap-2 ${
                  !uploadedImageFront ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Adicionar ao Carrinho
              </button>
              {!uploadedImageFront && (
                <p className="text-fd-white/50 text-sm text-center mt-2">
                  Faça upload de uma arte para continuar
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6 text-center">
            <h4 className="text-fd-gold font-bold mb-2">
              Produção Profissional
            </h4>
            <p className="text-fd-white/70 text-sm">
              Impressão em alta qualidade com durabilidade garantida
            </p>
          </div>
          <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6 text-center">
            <h4 className="text-fd-gold font-bold mb-2">
              Pedidos em Quantidade
            </h4>
            <p className="text-fd-white/70 text-sm">
              Descontos progressivos para pedidos acima de 10 unidades
            </p>
          </div>
          <div className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg p-6 text-center">
            <h4 className="text-fd-gold font-bold mb-2">Aprovação de Arte</h4>
            <p className="text-fd-white/70 text-sm">
              Nossa equipe revisa e ajusta sua arte antes da produção
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
