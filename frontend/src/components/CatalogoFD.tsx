import { useState } from "react";
import {
  ShoppingCart,
  Tag,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  AlertCircle,
  Layers,
  Shirt,
  Star,
} from "lucide-react";
import {
  opcoesPersonalizacao,
  coresDisponiveis,
  tamanhosDisponiveis,
  type ProductFD,
} from "../utils/catalogoFD";
import { useProducts, type ApiProduct } from "../hooks/useProducts";
import CatalogImageGuide from "./Catalogo/CatalogImageGuide";
import CatalogoHeader from "./Catalogo/CatalogoHeader";

function mapApiProductToFD(p: ApiProduct): ProductFD {
  const primaryImage =
    p.images.find((img) => img.isPrimary)?.url ?? p.images[0]?.url ?? "";
  return {
    id: p.id,
    category: p.category.slug,
    categoryLabel: p.category.name,
    name: p.name,
    type: p.fabricType,
    fabric: p.fabricType,
    description: p.description,
    prices: {
      fronteVerso: p.priceBoth,
      frente: p.priceFront,
      verso: p.priceBack,
    },
    image: primaryImage,
    available: p.available,
    requiresBudget: p.requiresBudget,
    obs: p.obs ?? undefined,
    badge: p.badge ?? undefined,
  };
}

interface CatalogoFDProps {
  onAddToCart?: (item: any) => void;
}

const BADGE_COLORS: Record<string, string> = {
  "MAIS VENDIDO": "bg-[#F5C542] text-black",
  PREMIUM: "bg-black text-[#F5C542] border border-[#F5C542]",
  TENDÊNCIA: "bg-[#D4B896] text-black",
  DESTAQUE: "bg-[#F5C542] text-black",
  "SOB ORÇAMENTO": "bg-red-600 text-white",
};

function PriceTable({
  product,
  highlight,
}: {
  product: ProductFD;
  highlight: string;
}) {
  return (
    <div className="w-full border border-white/10 overflow-hidden">
      <div className="bg-white/5 px-3 py-1.5 flex items-center gap-2">
        <Tag className="w-3.5 h-3.5 text-[#F5C542]" />
        <span className="text-[10px] uppercase tracking-widest text-[#D4B896]">
          Tabela de Preços
        </span>
      </div>
      {product.requiresBudget ? (
        <div className="px-4 py-3 text-center">
          <span className="text-[#F5C542] font-bold text-sm">
            Sob Orçamento
          </span>
          <p className="text-white/50 text-xs mt-1">{product.obs}</p>
        </div>
      ) : (
        <div>
          {opcoesPersonalizacao.map((opt, i) => (
            <div
              key={opt.id}
              className={`flex justify-between items-center px-4 py-2.5 transition-colors ${
                highlight === opt.key
                  ? "bg-[#F5C542]/15 border-l-2 border-[#F5C542]"
                  : "border-l-2 border-transparent"
              } ${i < 2 ? "border-b border-white/5" : ""}`}
            >
              <span className="text-white/70 text-sm">{opt.label}</span>
              <span
                className={`font-bold text-sm ${highlight === opt.key ? "text-[#F5C542]" : "text-white"}`}
              >
                R$ {product.prices[opt.key].toFixed(2).replace(".", ",")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  onSelect,
}: {
  product: ProductFD;
  onSelect: (p: ProductFD) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lowestPrice = product.requiresBudget
    ? null
    : Math.min(
        product.prices.frente,
        product.prices.verso,
        product.prices.fronteVerso,
      );

  return (
    <div
      className="group relative flex flex-col bg-[#111111] border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#F5C542]/60 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(245,197,66,0.15)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute top-3 left-3 z-20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${BADGE_COLORS[product.badge] ?? "bg-[#F5C542] text-black"}`}
        >
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1a1a1a]">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60" />

        {/* Fabric pill */}
        <div className="absolute bottom-3 right-3 bg-black/80 border border-white/20 px-2 py-1 backdrop-blur-sm">
          <span className="text-[10px] text-[#D4B896] uppercase tracking-wider">
            {product.fabric}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        {/* Name */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4B896] mb-1">
            {product.categoryLabel ?? product.category}
            {product.type ? ` · ${product.type}` : ""}
          </p>
          <h3
            className="text-xl text-white tracking-wide leading-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {product.name}
          </h3>
          <p className="text-white/50 text-xs mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price table */}
        {/* <PriceTable product={product} highlight="fronteVerso" /> */}

        {/* Starting price */}
        {lowestPrice && (
          <div className="flex items-baseline gap-1">
            <span className="text-white/40 text-xs">A partir de</span>
            <span className="text-[#F5C542] font-bold text-lg">
              R$ {lowestPrice.toFixed(2).replace(".", ",")}
            </span>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onSelect(product)}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 font-bold uppercase tracking-widest text-xs transition-all duration-300 ${
            product.requiresBudget
              ? "bg-transparent border border-white/30 text-white hover:border-[#F5C542] hover:text-[#F5C542]"
              : "bg-[#F5C542] text-black hover:bg-[#E0A81F] hover:shadow-[0_0_20px_rgba(245,197,66,0.4)]"
          }`}
        >
          {product.requiresBudget ? (
            <>
              <AlertCircle className="w-4 h-4" /> Solicitar Orçamento
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" /> Personalizar & Comprar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function CustomizationModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: ProductFD;
  onClose: () => void;
  onAddToCart?: (item: any) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<
    "fronteVerso" | "frente" | "verso"
  >("fronteVerso");
  const [selectedColor, setSelectedColor] = useState(coresDisponiveis[0]);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const unitPrice = product.prices[selectedOption];
  const total = unitPrice * quantity;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        product: {
          id: product.id,
          name: product.name,
          category: product.category,
          description: product.description,
          basePrice: unitPrice,
          images: [product.image],
          available: product.available,
        },
        printOption: selectedOption,
        color: selectedColor.hex,
        size: selectedSize,
        quantity,
        subtotal: total,
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#0D0D0D] border border-white/10 w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0D0D0D] z-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4B896]">
              Personalização
            </p>
            <h3
              className="text-2xl text-[#F5C542] tracking-wide"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {product.name}
            </h3>
            <p className="text-white/40 text-xs">{product.fabric}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center border border-white/20 text-white/60 hover:border-[#F5C542] hover:text-[#F5C542] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Image */}
          <div className="aspect-video overflow-hidden bg-[#1a1a1a] relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4">
              <div className="inline-flex items-center gap-2 bg-[#F5C542] px-3 py-1">
                <Shirt className="w-3.5 h-3.5 text-black" />
                <span className="text-[11px] font-bold text-black uppercase tracking-wider">
                  {product.type}
                </span>
              </div>
            </div>
          </div>

          {/* Print Option */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4B896] mb-3 flex items-center gap-2">
              <Layers className="w-3 h-3" /> Opção de Impressão
            </p>
            <div className="grid grid-cols-3 gap-2">
              {opcoesPersonalizacao.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.key)}
                  className={`flex flex-col items-center gap-1 p-3 border text-center transition-all ${
                    selectedOption === opt.key
                      ? "border-[#F5C542] bg-[#F5C542]/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span
                    className={`text-xs ${selectedOption === opt.key ? "text-[#F5C542]" : "text-white/60"}`}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={`font-bold text-base ${selectedOption === opt.key ? "text-[#F5C542]" : "text-white"}`}
                  >
                    R$ {product.prices[opt.key].toFixed(2).replace(".", ",")}
                  </span>
                  {selectedOption === opt.key && (
                    <Check className="w-3 h-3 text-[#F5C542]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4B896] mb-3">
              Cor do Tecido —{" "}
              <span className="text-white/60 normal-case">
                {selectedColor.name}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {coresDisponiveis.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  className={`w-10 h-10 transition-all relative ${
                    selectedColor.hex === color.hex
                      ? "ring-2 ring-[#F5C542] ring-offset-2 ring-offset-[#0D0D0D] scale-110"
                      : "hover:scale-105"
                  } ${color.hex === "#ffffff" ? "border border-white/20" : ""}`}
                  style={{ backgroundColor: color.hex }}
                >
                  {selectedColor.hex === color.hex && (
                    <Check
                      className="w-4 h-4 absolute inset-0 m-auto"
                      style={{
                        color:
                          color.hex === "#ffffff" || color.hex === "#F5C542"
                            ? "#000"
                            : "#fff",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4B896] mb-3">
              Tamanho
            </p>
            <div className="flex flex-wrap gap-2">
              {tamanhosDisponiveis.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] px-4 py-2 text-sm font-bold border transition-all ${
                    selectedSize === size
                      ? "bg-[#F5C542] text-black border-[#F5C542]"
                      : "border-white/20 text-white/70 hover:border-white/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D4B896] mb-3">
              Quantidade
            </p>
            <div className="flex items-center gap-3 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-11 h-11 flex items-center justify-center border border-white/20 text-white hover:border-[#F5C542] hover:text-[#F5C542] transition-colors text-xl"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 h-11 text-center bg-transparent border border-white/20 text-white font-bold focus:border-[#F5C542] focus:outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-11 h-11 flex items-center justify-center border border-white/20 text-white hover:border-[#F5C542] hover:text-[#F5C542] transition-colors text-xl"
              >
                +
              </button>
            </div>
          </div>

          {/* OBS */}
          {product.obs && !product.requiresBudget && (
            <div className="flex items-start gap-2 p-3 bg-[#F5C542]/10 border border-[#F5C542]/30">
              <AlertCircle className="w-4 h-4 text-[#F5C542] mt-0.5 flex-shrink-0" />
              <p className="text-[#F5C542] text-xs">{product.obs}</p>
            </div>
          )}

          {/* Total Box */}
          <div className="bg-[#111] border border-white/10 p-5">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
              <span className="text-white/50 text-sm">Unitário</span>
              <span className="text-white font-bold">
                R$ {unitPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
              <span className="text-white/50 text-sm">Quantidade</span>
              <span className="text-white font-bold">× {quantity}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#D4B896] text-sm uppercase tracking-wider">
                Total
              </span>
              <span
                className="text-[#F5C542] text-3xl font-bold"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-3 bg-[#F5C542] text-black py-4 font-bold uppercase tracking-widest hover:bg-[#E0A81F] transition-all hover:shadow-[0_0_30px_rgba(245,197,66,0.4)] active:scale-[0.98]"
          >
            <ShoppingCart className="w-5 h-5" />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

export function CatalogoFD({ onAddToCart }: CatalogoFDProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<ProductFD | null>(
    null,
  );
  const [showGuia, setShowGuia] = useState(false);

  const { products: apiProducts, isLoading } = useProducts({
    available: true,
    limit: 100,
  });
  const catalogoFD = apiProducts.map(mapApiProductToFD);

  // Abas de categoria construídas dinamicamente a partir dos produtos cadastrados
  const categoryTabs = Array.from(
    new Map(
      catalogoFD.map((p) => [p.category, p.categoryLabel ?? p.category]),
    ).entries(),
  );

  const filteredProducts =
    activeCategory === "all"
      ? catalogoFD
      : catalogoFD.filter((p) => p.category === activeCategory);

  const handleSelect = (product: ProductFD) => {
    if (product.requiresBudget) {
      alert(
        `📋 ${product.name} — Sob Orçamento\n\n${product.obs}\n\nEntre em contato para solicitar seu orçamento:\n📱 WhatsApp: (XX) XXXXX-XXXX`,
      );
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <section className="bg-[#0A0A0A] py-10 relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #F5C542 0, #F5C542 1px, transparent 0, transparent 50%)`,
          backgroundSize: "20px 20px",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {/* ─── SECTION HEADER ─── */}
        {/* <div className="mb-14">
          <CatalogoHeader />
          <CatalogImageGuide />
        </div> */}

        {/* ─── CATEGORY TABS ─── */}
        <div className="flex items-stretch gap-0 mb-10 border border-white/10 w-fit flex-wrap">
          {[
            { key: "all", label: "Todos", count: catalogoFD.length },
            ...categoryTabs.map(([slug, label]) => ({
              key: slug,
              label,
              count: catalogoFD.filter((p) => p.category === slug).length,
            })),
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all ${
                activeCategory === key
                  ? "bg-[#F5C542] text-black"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {label}
              <span
                className={`text-[10px] px-1.5 py-0.5 ${
                  activeCategory === key
                    ? "bg-black/20 text-black"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ─── PRODUCT GRID ─── */}
        {isLoading ? (
          <div className="text-white/50 text-sm py-12 text-center">
            Carregando catálogo...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-white/50 text-sm py-12 text-center">
            Nenhum produto disponível nesta categoria no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}

        {/* ─── BOTTOM INFO BAR ─── */}
        <div className="mt-14 border-t border-white/10 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: "🎨",
              title: "Impressão DTF",
              desc: "Alta qualidade, cores vivas, durabilidade garantida",
            },
            {
              icon: "📐",
              title: "PP ao XXG",
              desc: "Grade completa de tamanhos disponível em todos os modelos",
            },
            {
              icon: "🚀",
              title: "Produção Rápida",
              desc: "Prazo conforme quantidade — entre em contato para mais info",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-[#F5C542] text-sm font-bold uppercase tracking-wider">
                {item.title}
              </p>
              <p className="text-white/40 text-xs max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── CUSTOMIZATION MODAL ─── */}
      {selectedProduct && (
        <CustomizationModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
}
