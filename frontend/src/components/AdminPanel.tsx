// src/components/AdminPanel.tsx
import { useState } from 'react'
import { X, Plus, Edit2, Trash2, Save, Loader2, Tag, Shirt } from 'lucide-react'
import {
  useCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../hooks/useCategories'
import {
  useProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ApiProduct,
} from '../hooks/useProducts'

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
}

function extractErrorMessage(err: unknown, fallback: string): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? fallback
  )
}

// ── Aba de Categorias ──────────────────────────────────────
function CategoriesTab() {
  const { categories, isLoading, refresh } = useCategories()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', description: '', imageUrl: '' })
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setForm({ name: '', description: '', imageUrl: '' })
    setEditingId(null)
  }

  const handleEdit = (id: string) => {
    const category = categories.find(c => c.id === id)
    if (!category) return
    setEditingId(id)
    setForm({
      name: category.name,
      description: category.description ?? '',
      imageUrl: category.imageUrl ?? '',
    })
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Informe o nome da categoria.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
      }
      if (editingId) {
        await updateCategory(editingId, payload)
      } else {
        await createCategory(payload)
      }
      resetForm()
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao salvar categoria.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta categoria?')) return
    try {
      await deleteCategory(id)
      if (editingId === id) resetForm()
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao excluir categoria.'))
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded p-3">
          {error}
        </div>
      )}

      {/* Formulário */}
      <div className="bg-fd-black/50 border border-fd-gold/10 rounded-lg p-4 space-y-3">
        <h4 className="text-fd-white font-semibold">
          {editingId ? 'Editar Categoria' : 'Nova Categoria'}
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Nome *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
          />
          <input
            type="text"
            placeholder="URL da imagem (opcional)"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="sm:col-span-2 w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
            rows={2}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editingId ? 'Salvar Alterações' : 'Adicionar Categoria'}
          </button>
          {editingId && (
            <button onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <p className="text-fd-white/60 text-sm">Carregando categorias...</p>
      ) : categories.length === 0 ? (
        <p className="text-fd-white/60 text-sm">Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-fd-black/50 border border-fd-gold/10 rounded-lg p-4 flex items-start justify-between gap-3"
            >
              <div>
                <p className="text-fd-white font-semibold">{category.name}</p>
                <p className="text-fd-white/50 text-xs">/{category.slug}</p>
                <p className="text-fd-white/40 text-xs mt-1">
                  {category._count?.products ?? 0} produto(s)
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(category.id)}
                  className="p-2 text-fd-white/60 hover:text-fd-gold transition-colors"
                  aria-label="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-fd-white/60 hover:text-red-400 transition-colors"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Aba de Produtos ─────────────────────────────────────────
const emptyProductForm = {
  categoryId: '',
  name: '',
  description: '',
  fabricType: '',
  priceFront: '',
  priceBack: '',
  priceBoth: '',
  imageUrl: '',
  color: '',
  size: '',
  stock: '10',
  available: true,
}

function ProductsTab() {
  const { categories } = useCategories()
  const { products, isLoading } = useProducts({ limit: 100 })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyProductForm)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setForm(emptyProductForm)
    setEditingId(null)
  }

  const handleEdit = (product: ApiProduct) => {
    setEditingId(product.id)
    setForm({
      categoryId: product.category.id,
      name: product.name,
      description: product.description,
      fabricType: product.fabricType,
      priceFront: String(product.priceFront),
      priceBack: String(product.priceBack),
      priceBoth: String(product.priceBoth),
      imageUrl: product.images.find(i => i.isPrimary)?.url ?? product.images[0]?.url ?? '',
      color: '',
      size: '',
      stock: '10',
      available: product.available,
    })
  }

  const handleSave = async () => {
    if (!form.categoryId || !form.name.trim() || !form.description.trim()) {
      setError('Preencha categoria, nome e descrição.')
      return
    }

    setSaving(true)
    setError(null)
    try {
      if (editingId) {
        await updateProduct(editingId, {
          categoryId: form.categoryId,
          name: form.name,
          description: form.description,
          fabricType: form.fabricType,
          priceFront: Number(form.priceFront) || 0,
          priceBack: Number(form.priceBack) || 0,
          priceBoth: Number(form.priceBoth) || 0,
          available: form.available,
        })
      } else {
        if (!form.imageUrl.trim() || !form.color.trim() || !form.size.trim()) {
          setError('Preencha imagem, cor e tamanho para criar o produto.')
          setSaving(false)
          return
        }
        await createProduct({
          categoryId: form.categoryId,
          name: form.name,
          description: form.description,
          fabricType: form.fabricType || 'Não informado',
          priceFront: Number(form.priceFront) || 0,
          priceBack: Number(form.priceBack) || 0,
          priceBoth: Number(form.priceBoth) || 0,
          available: form.available,
          images: [{ url: form.imageUrl, isPrimary: true, order: 0 }],
          variants: [
            {
              variantId: `${form.color}-${form.size}`.toLowerCase().replace(/\s+/g, '-'),
              color: form.color,
              size: form.size,
              stock: Number(form.stock) || 0,
            },
          ],
        })
      }
      resetForm()
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao salvar produto.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir (desativar) este produto?')) return
    try {
      await deleteProduct(id)
      if (editingId === id) resetForm()
    } catch (err) {
      setError(extractErrorMessage(err, 'Erro ao excluir produto.'))
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded p-3">
          {error}
        </div>
      )}

      {/* Formulário */}
      <div className="bg-fd-black/50 border border-fd-gold/10 rounded-lg p-4 space-y-3">
        <h4 className="text-fd-white font-semibold">
          {editingId ? 'Editar Produto' : 'Novo Produto'}
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          <select
            value={form.categoryId}
            onChange={e => setForm({ ...form, categoryId: e.target.value })}
            className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
          >
            <option value="">Selecione a categoria *</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Nome *"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
          />
          <input
            type="text"
            placeholder="Tipo de tecido"
            value={form.fabricType}
            onChange={e => setForm({ ...form, fabricType: e.target.value })}
            className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
          />
          <input
            type="text"
            placeholder="URL da imagem principal"
            value={form.imageUrl}
            onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            disabled={!!editingId}
            className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white disabled:opacity-40"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço frente (R$)"
            value={form.priceFront}
            onChange={e => setForm({ ...form, priceFront: e.target.value })}
            className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço verso (R$)"
            value={form.priceBack}
            onChange={e => setForm({ ...form, priceBack: e.target.value })}
            className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço frente+verso (R$)"
            value={form.priceBoth}
            onChange={e => setForm({ ...form, priceBoth: e.target.value })}
            className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
          />
          <label className="flex items-center gap-2 text-fd-white/80 text-sm">
            <input
              type="checkbox"
              checked={form.available}
              onChange={e => setForm({ ...form, available: e.target.checked })}
            />
            Disponível para venda
          </label>
          <textarea
            placeholder="Descrição *"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="sm:col-span-2 w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
            rows={2}
          />

          {!editingId && (
            <>
              <input
                type="text"
                placeholder="Cor da 1ª variante *"
                value={form.color}
                onChange={e => setForm({ ...form, color: e.target.value })}
                className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
              />
              <input
                type="text"
                placeholder="Tamanho da 1ª variante *"
                value={form.size}
                onChange={e => setForm({ ...form, size: e.target.value })}
                className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
              />
              <input
                type="number"
                placeholder="Estoque"
                value={form.stock}
                onChange={e => setForm({ ...form, stock: e.target.value })}
                className="w-full bg-fd-gray/50 border border-fd-gold/20 rounded px-4 py-2 text-fd-white"
              />
            </>
          )}
        </div>
        {!editingId && (
          <p className="text-fd-white/40 text-xs">
            * A edição posterior não altera imagens/variantes — apenas os dados básicos do produto.
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {editingId ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
          {editingId && (
            <button onClick={resetForm} className="btn-secondary">
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <p className="text-fd-white/60 text-sm">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="text-fd-white/60 text-sm">Nenhum produto cadastrado ainda.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {products.map(product => (
            <div
              key={product.id}
              className="bg-fd-black/50 border border-fd-gold/10 rounded-lg p-4 flex items-start justify-between gap-3"
            >
              <div>
                <p className="text-fd-white font-semibold">
                  {product.name}{' '}
                  {!product.available && (
                    <span className="text-red-400 text-xs">(inativo)</span>
                  )}
                </p>
                <p className="text-fd-white/50 text-xs">{product.category.name}</p>
                <p className="text-fd-gold text-sm mt-1">
                  R$ {Number(product.priceBoth).toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 text-fd-white/60 hover:text-fd-gold transition-colors"
                  aria-label="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 text-fd-white/60 hover:text-red-400 transition-colors"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const [tab, setTab] = useState<'categories' | 'products'>('categories')

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-fd-black/80 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-4 sm:inset-x-10 sm:inset-y-10 bg-fd-gray z-50 shadow-2xl rounded-lg flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-fd-gray-lighter">
          <h2 className="text-fd-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-fd-gold" />
            Painel Administrativo
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:text-fd-gold transition-colors"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-0 border-b border-fd-gray-lighter px-6">
          <button
            onClick={() => setTab('categories')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold uppercase tracking-wide border-b-2 transition-colors ${
              tab === 'categories'
                ? 'border-fd-gold text-fd-gold'
                : 'border-transparent text-fd-white/50 hover:text-fd-white'
            }`}
          >
            <Tag className="w-4 h-4" /> Categorias
          </button>
          <button
            onClick={() => setTab('products')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold uppercase tracking-wide border-b-2 transition-colors ${
              tab === 'products'
                ? 'border-fd-gold text-fd-gold'
                : 'border-transparent text-fd-white/50 hover:text-fd-white'
            }`}
          >
            <Shirt className="w-4 h-4" /> Produtos
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-gold p-6">
          {tab === 'categories' ? <CategoriesTab /> : <ProductsTab />}
        </div>
      </div>
    </>
  )
}
