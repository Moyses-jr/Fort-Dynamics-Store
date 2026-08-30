import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import type { Product, ProductColor } from "../types";
import { useProducts, type ApiProduct } from "../hooks/useProducts";

interface ProductTemplate {
  id: string;
  name: string;
  category: "camisetas" | "moletons";
  model: string; // básica, polo, oversized, etc.
  fabricType: string;
  basePrice: number;
  colors: ProductColor[];
  sizes: string[];
  description: string;
  image: string;
}

interface ProductManagerProps {
  onProductsUpdate: (products: ProductTemplate[]) => void;
}

export function ProductManager({ onProductsUpdate }: ProductManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductTemplate | null>(
    null,
  );

  // Busca a lista real de produtos no backend (GET /products)
  const { products: apiProducts, isLoading: isLoadingProducts } = useProducts({
    limit: 100,
  });
  const [products, setProducts] = useState<ProductTemplate[]>([]);

  useEffect(() => {
    const mapped: ProductTemplate[] = apiProducts.map((p: ApiProduct) => ({
      id: p.id,
      name: p.name,
      category: p.category.slug === "moletons" ? "moletons" : "camisetas",
      model: p.fabricType,
      fabricType: p.fabricType,
      basePrice: p.priceBoth,
      colors: p.colors.map((c) => ({
        name: c.name,
        hex: c.hex,
        available: c.available,
      })),
      sizes: p.sizes.map((s) => s.size),
      description: p.description,
      image: p.images.find((i) => i.isPrimary)?.url ?? p.images[0]?.url ?? "",
    }));
    setProducts(mapped);
  }, [apiProducts]);

  const [newProduct, setNewProduct] = useState<ProductTemplate>({
    id: "",
    name: "",
    category: "camisetas",
    model: "",
    fabricType: "",
    basePrice: 0,
    colors: [],
    sizes: [],
    description: "",
    image: "",
  });

  const handleSave = () => {
    if (editingProduct) {
      // Editar produto existente
      const updated = products.map((p) =>
        p.id === editingProduct.id ? editingProduct : p,
      );
      setProducts(updated);
      onProductsUpdate(updated);
      setEditingProduct(null);
    } else {
      // Adicionar novo produto
      const newId = `template-${Date.now()}`;
      const productToAdd = { ...newProduct, id: newId };
      const updated = [...products, productToAdd];
      setProducts(updated);
      onProductsUpdate(updated);
      setNewProduct({
        id: "",
        name: "",
        category: "camisetas",
        model: "",
        fabricType: "",
        basePrice: 0,
        colors: [],
        sizes: [],
        description: "",
        image: "",
      });
    }
  };

  const handleDelete = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    onProductsUpdate(updated);
  };

  const camisetas = products.filter((p) => p.category === "camisetas");
  const moletons = products.filter((p) => p.category === "moletons");

  return (
    <div className="container-fd py-12">
      {/* Header com botão de gerenciar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-fd-white mb-2">
            LINHA DE <span className="text-gold-gradient">MODA</span>
          </h2>
          <p className="text-fd-white/70 text-lg">
            Camisetas e moletons premium com variedade de modelos, cores e
            tecidos
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-primary btn-primary-lg flex items-center gap-2"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
          {isOpen ? "Fechar" : "Gerenciar Produtos"}
        </button>
      </div>

      {/* Painel de Gerenciamento */}
      {isOpen && (
        <div className="bg-fd-gray/30 border border-fd-gold/20 rounded-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-fd-white mb-6 flex items-center gap-2">
            <Edit2 className="w-6 h-6 text-fd-gold" />
            Painel de Gerenciamento
          </h3>

          {/* Lista de produtos para editar */}
          {isLoadingProducts ? (
            <p className="text-fd-white/60 text-sm mb-6">
              Carregando produtos...
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-fd-black/50 border border-fd-gold/10 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-fd-white font-semibold mb-1">
                        {product.name}
                      </h4>
                      <p className="text-fd-white/60 text-sm mb-2">
                        {product.model} • {product.fabricType}
                      </p>
                      <p className="text-fd-gold font-bold">
                        R$ {product.basePrice.toFixed(2)}
                      </p>
                      <div className="flex gap-1 mt-2">
                        {product.colors.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-fd-white/30"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-2 bg-fd-gold/20 hover:bg-fd-gold/30 text-fd-gold rounded transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Formulário de adição/edição */}
          <div className="bg-fd-black/80 border border-fd-gold/20 rounded-lg p-6">
            <h4 className="text-xl font-bold text-fd-white mb-4">
              {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-fd-white/80 mb-2 text-sm">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={editingProduct?.name || newProduct.name}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({
                          ...editingProduct,
                          name: e.target.value,
                        })
                      : setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
                  placeholder="Ex: Camiseta Premium"
                />
              </div>

              <div>
                <label className="block text-fd-white/80 mb-2 text-sm">
                  Categoria
                </label>
                <select
                  value={editingProduct?.category || newProduct.category}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({
                          ...editingProduct,
                          category: e.target.value as any,
                        })
                      : setNewProduct({
                          ...newProduct,
                          category: e.target.value as any,
                        })
                  }
                  className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
                >
                  <option value="camisetas">Camisetas</option>
                  <option value="moletons">Moletons</option>
                </select>
              </div>

              <div>
                <label className="block text-fd-white/80 mb-2 text-sm">
                  Modelo
                </label>
                <input
                  type="text"
                  value={editingProduct?.model || newProduct.model}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({
                          ...editingProduct,
                          model: e.target.value,
                        })
                      : setNewProduct({ ...newProduct, model: e.target.value })
                  }
                  className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
                  placeholder="Ex: Básica, Polo, Oversized"
                />
              </div>

              <div>
                <label className="block text-fd-white/80 mb-2 text-sm">
                  Tipo de Tecido
                </label>
                <input
                  type="text"
                  value={editingProduct?.fabricType || newProduct.fabricType}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({
                          ...editingProduct,
                          fabricType: e.target.value,
                        })
                      : setNewProduct({
                          ...newProduct,
                          fabricType: e.target.value,
                        })
                  }
                  className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
                  placeholder="Ex: 100% Algodão, Piquet"
                />
              </div>

              <div>
                <label className="block text-fd-white/80 mb-2 text-sm">
                  Preço Base (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct?.basePrice || newProduct.basePrice}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({
                          ...editingProduct,
                          basePrice: parseFloat(e.target.value),
                        })
                      : setNewProduct({
                          ...newProduct,
                          basePrice: parseFloat(e.target.value),
                        })
                  }
                  className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
                  placeholder="99.90"
                />
              </div>

              <div>
                <label className="block text-fd-white/80 mb-2 text-sm">
                  URL da Imagem
                </label>
                <input
                  type="text"
                  value={editingProduct?.image || newProduct.image}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({
                          ...editingProduct,
                          image: e.target.value,
                        })
                      : setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-fd-white/80 mb-2 text-sm">
                  Descrição
                </label>
                <textarea
                  value={editingProduct?.description || newProduct.description}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({
                          ...editingProduct,
                          description: e.target.value,
                        })
                      : setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                  }
                  className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
                  rows={2}
                  placeholder="Descrição do produto..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSave}
                className="btn-primary btn-primary-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingProduct ? "Salvar Alterações" : "Adicionar Produto"}
              </button>
              {editingProduct && (
                <button
                  onClick={() => setEditingProduct(null)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid de Produtos - Camisetas */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-fd-white mb-6 border-l-4 border-fd-gold pl-4">
          CAMISETAS
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {camisetas.map((product) => (
            <div
              key={product.id}
              className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg overflow-hidden hover:border-fd-gold/50 transition-all group"
            >
              <div className="aspect-square overflow-hidden bg-fd-gray/40">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="text-fd-white font-semibold mb-1">
                  {product.name}
                </h4>
                <p className="text-fd-white/60 text-sm mb-2">
                  {product.model} • {product.fabricType}
                </p>
                <p className="text-fd-gold font-bold text-lg mb-3">
                  R$ {product.basePrice.toFixed(2)}
                </p>

                <div className="flex gap-2 flex-wrap mb-3">
                  {product.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-fd-white/30"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>

                <div className="flex gap-1 flex-wrap">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-2 py-1 bg-fd-black/50 text-fd-white/70 text-xs rounded"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de Produtos - Moletons */}
      <div>
        <h3 className="text-2xl font-bold text-fd-white mb-6 border-l-4 border-fd-gold pl-4">
          MOLETONS
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {moletons.map((product) => (
            <div
              key={product.id}
              className="bg-fd-gray/20 border border-fd-gold/20 rounded-lg overflow-hidden hover:border-fd-gold/50 transition-all group"
            >
              <div className="aspect-square overflow-hidden bg-fd-gray/40">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="text-fd-white font-semibold mb-1">
                  {product.name}
                </h4>
                <p className="text-fd-white/60 text-sm mb-2">
                  {product.model} • {product.fabricType}
                </p>
                <p className="text-fd-gold font-bold text-lg mb-3">
                  R$ {product.basePrice.toFixed(2)}
                </p>

                <div className="flex gap-2 flex-wrap mb-3">
                  {product.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full border-2 border-fd-white/30"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>

                <div className="flex gap-1 flex-wrap">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className="px-2 py-1 bg-fd-black/50 text-fd-white/70 text-xs rounded"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
