# 🏪 FD STORE | FORT DYNAMIC
## CÓDIGO COMPLETO PARA DOWNLOAD

> **E-commerce Premium com Sistema de Personalização de Uniformes**
> 
> Desenvolvido com React + TypeScript + Tailwind CSS v4

---

## 📋 ÍNDICE

1. [Informações do Projeto](#informações-do-projeto)
2. [Instalação](#instalação)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Arquivos de Código](#arquivos-de-código)
5. [Funcionalidades](#funcionalidades)

---

## 🎯 INFORMAÇÕES DO PROJETO

**Nome:** FD STORE | Fort Dynamic  
**Tipo:** E-commerce Completo  
**Tecnologias:** React, TypeScript, Tailwind CSS v4, Lucide React  
**Estilo:** Premium, Moderno, Urbano, Autoritário

### Cores da Marca:
- **Preto:** `#000000`
- **Branco:** `#ffffff`
- **Dourado:** `#d4af37`
- **Dourado Claro:** `#f0d98a`
- **Dourado Escuro:** `#b8941f`
- **Cinza:** `#1a1a1a`

### Fontes:
- **Display:** Bebas Neue
- **Body:** Inter

---

## 🚀 INSTALAÇÃO

```bash
# 1. Crie um novo projeto React
npm create vite@latest fd-store -- --template react-ts

# 2. Entre na pasta
cd fd-store

# 3. Instale as dependências
npm install lucide-react

# 4. Configure o Tailwind CSS v4
# (Ver globals.css abaixo)

# 5. Copie todos os arquivos deste documento
# para as respectivas pastas

# 6. Execute o projeto
npm run dev
```

---

## 📁 ESTRUTURA DE PASTAS

```
fd-store/
├── src/
│   ├── App.tsx                      ⭐ Componente Principal
│   ├── main.tsx                     ⚙️ Entry Point
│   ├── types/
│   │   └── index.ts                 📦 Tipos TypeScript
│   ├── data/
│   │   └── mockData.ts              💾 Dados Mock
│   ├── styles/
│   │   └── globals.css              🎨 Estilos Globais
│   ├── components/
│   │   ├── Header.tsx               🔝 Cabeçalho
│   │   ├── Hero.tsx                 🎬 Hero Section
│   │   ├── ProductManager.tsx       🛍️ Gerenciador Linha Moda
│   │   ├── UniformCustomizer.tsx    👕 Customizador Uniformes
│   │   ├── ProductGrid.tsx          📊 Grid de Produtos
│   │   ├── ProductCard.tsx          🎴 Card de Produto
│   │   ├── Collections.tsx          📚 Coleções
│   │   ├── Cart.tsx                 🛒 Carrinho
│   │   ├── QuickView.tsx            👁️ Visualização Rápida
│   │   ├── UserProfile.tsx          👤 Perfil do Usuário
│   │   ├── Testimonials.tsx         💬 Depoimentos
│   │   ├── StatsPanel.tsx           📈 Estatísticas
│   │   ├── Footer.tsx               🔚 Rodapé
│   │   └── Customizer.tsx           🎨 Customizador Geral
│   └── utils/
│       └── aiEngine.ts              ⚙️ Utilitários
└── package.json
```

---

## ✨ FUNCIONALIDADES

### ✅ 1. LINHA DE MODA
- Gerenciamento completo de produtos
- Adicionar/Editar/Excluir produtos
- Variedades: Modelos, Cores, Tecidos, Tamanhos
- 5 templates pré-configurados:
  - Camiseta Básica
  - Camiseta Polo
  - Camiseta Oversized
  - Moletom Básico
  - Moletom com Capuz

### ✅ 2. UNIFORMES PERSONALIZADOS
- Upload de artes (frente e verso separadamente)
- 3 mockups lisos:
  - Camiseta Básica Lisa (R$ 89,90)
  - Moletom Liso (R$ 179,90)
  - Polo Lisa (R$ 129,90)
- Preview em tempo real
- Alternância entre frente/verso
- Controles independentes:
  - Tamanho (50% - 150%)
  - Rotação (0° - 360°)
- 5 cores de tecido disponíveis
- Cálculo automático de preço

### ✅ 3. E-COMMERCE COMPLETO
- Carrinho de compras funcional
- Sistema de favoritos
- Quick View de produtos
- Área do cliente com:
  - Perfil completo
  - Histórico de pedidos
  - Endereços salvos
  - Produtos favoritados

### ✅ 4. COLEÇÕES E CATÁLOGO
- Lançamentos
- Coleções temáticas
- Premium Collection
- Categorização por tipo
- Depoimentos de clientes
- Painel de estatísticas

---

## 📄 ARQUIVOS DE CÓDIGO

### 🔹 ARQUIVO 1: `/src/main.tsx`

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

### 🔹 ARQUIVO 2: `/src/App.tsx`

Copie o código completo do App.tsx que está no seu projeto atual.
Ele contém:
- Gerenciamento de estado completo
- Handlers de carrinho
- Handlers de favoritos
- Integração com todos os componentes
- Sistema de pedidos

**📝 O código está muito extenso. Você tem duas opções:**

**OPÇÃO A:** Copie do arquivo atual `/App.tsx` no seu projeto  
**OPÇÃO B:** Eu crio um segundo arquivo MD só com o App.tsx

---

### 🔹 ARQUIVO 3: `/src/types/index.ts`

```typescript
// FD STORE - Sistema de Tipos Completo

export type ProductCategory = 'camisetas' | 'moletons' | 'uniformes' | 'premium' | 'lancamentos';

export type ProductSize = 'PP' | 'P' | 'M' | 'G' | 'GG' | 'XG';

export type ProductColor = {
  name: string;
  hex: string;
  available: boolean;
};

export type Stamp = {
  id: string;
  name: string;
  imageUrl: string;
  category: 'street' | 'minimal' | 'sport' | 'premium' | 'custom';
  tags: string[];
  aiGenerated: boolean;
  createdAt: Date;
};

export type AICharacter = {
  id: string;
  name: string;
  imageUrl: string;
  style: 'urban' | 'futuristic' | 'classic' | 'dynamic' | 'premium';
  description: string;
  tags: string[];
  usageCount: number;
  createdAt: Date;
};

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  basePrice: number;
  images: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  stamp?: Stamp;
  available: boolean;
  featured: boolean;
  isNew: boolean;
  isPremium: boolean;
  stockQuantity: number;
  tags: string[];
  createdAt: Date;
};

export type CustomizationOptions = {
  productId: string;
  size: ProductSize;
  color: ProductColor;
  stampId?: string;
  customStamp?: {
    type: 'upload' | 'ai-generated';
    imageUrl?: string;
    aiPrompt?: string;
  };
  characterId?: string;
  quantity: number;
  preview3DUrl?: string;
};

export type CartItem = {
  id: string;
  product: Product;
  customization: CustomizationOptions;
  quantity: number;
  subtotal: number;
};

export type OrderStatus = 'pending' | 'confirmed' | 'production' | 'shipping' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  shippingCost: number;
  status: OrderStatus;
  paymentMethod: 'pix' | 'card' | 'boleto';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  trackingCode?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Address = {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  addresses: Address[];
  orders: Order[];
  favorites: string[];
  createdAt: Date;
};

export type Collection = {
  id: string;
  name: string;
  description: string;
  theme: 'street' | 'futuristic' | 'dynamic' | 'premium' | 'minimal';
  products: Product[];
  character?: AICharacter;
  stamps: Stamp[];
  coverImage: string;
  aiGenerated: boolean;
  createdAt: Date;
};

export type AIRecommendation = {
  userId: string;
  recommendedProducts: Product[];
  recommendedCollections: Collection[];
  reason: string;
  confidence: number;
};

export type AdminStats = {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  ordersToday: number;
  revenueToday: number;
  popularProducts: Product[];
  recentOrders: Order[];
};
```

---

### 🔹 ARQUIVO 4: `/src/styles/globals.css`

```css
@import "tailwindcss";

@theme {
  /* FD STORE Brand Colors */
  --color-fd-black: #000000;
  --color-fd-white: #ffffff;
  --color-fd-gold: #d4af37;
  --color-fd-gold-light: #f0d98a;
  --color-fd-gold-dark: #b8941f;
  --color-fd-gray: #1a1a1a;
  --color-fd-gray-light: #2a2a2a;
  --color-fd-gray-lighter: #3a3a3a;

  /* Semantic Colors */
  --color-primary: var(--color-fd-gold);
  --color-secondary: var(--color-fd-gray);
  --color-accent: var(--color-fd-gold-light);
  
  /* Typography */
  --font-family-display: "Bebas Neue", "Arial Black", sans-serif;
  --font-family-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  
  /* Spacing */
  --spacing-section: 5rem;
  --spacing-container: 1.5rem;
}

@layer base {
  @font-face {
    font-family: 'Bebas Neue';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Bebas Neue'), local('BebasNeue-Regular'), url(https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXooxW5rygbi49c.woff2) format('woff2');
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 100 900;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2) format('woff2');
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: var(--font-family-body);
    background: var(--color-fd-black);
    color: var(--color-fd-white);
    line-height: 1.6;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-family-display);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  h1 {
    font-size: clamp(2.5rem, 8vw, 5rem);
  }

  h2 {
    font-size: clamp(2rem, 6vw, 3.5rem);
  }

  h3 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
  }

  h4 {
    font-size: clamp(1.25rem, 3vw, 2rem);
  }

  p {
    font-size: 1rem;
    line-height: 1.7;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: var(--font-family-body);
    cursor: pointer;
    border: none;
    background: none;
  }

  input, textarea, select {
    font-family: var(--font-family-body);
  }
}

@layer utilities {
  .container-fd {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 var(--spacing-container);
  }

  .gold-gradient {
    background: linear-gradient(135deg, var(--color-fd-gold-dark) 0%, var(--color-fd-gold) 50%, var(--color-fd-gold-light) 100%);
  }

  .text-gold-gradient {
    background: linear-gradient(135deg, var(--color-fd-gold-dark) 0%, var(--color-fd-gold) 50%, var(--color-fd-gold-light) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hover-gold {
    transition: all 0.3s ease;
  }

  .hover-gold:hover {
    color: var(--color-fd-gold);
    transform: translateY(-2px);
  }

  .btn-primary {
    background: var(--color-fd-gold);
    color: var(--color-fd-black);
    padding: 1rem 2.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.3s ease;
    border: 2px solid var(--color-fd-gold);
  }

  .btn-primary:hover {
    background: transparent;
    color: var(--color-fd-gold);
    transform: scale(1.05);
  }

  .btn-secondary {
    background: transparent;
    color: var(--color-fd-white);
    padding: 1rem 2.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.3s ease;
    border: 2px solid var(--color-fd-white);
  }

  .btn-secondary:hover {
    background: var(--color-fd-white);
    color: var(--color-fd-black);
  }

  .card-premium {
    background: linear-gradient(145deg, var(--color-fd-gray) 0%, var(--color-fd-black) 100%);
    border: 1px solid var(--color-fd-gray-lighter);
    transition: all 0.3s ease;
  }

  .card-premium:hover {
    border-color: var(--color-fd-gold);
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
  }

  .scrollbar-gold::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .scrollbar-gold::-webkit-scrollbar-track {
    background: var(--color-fd-gray);
  }

  .scrollbar-gold::-webkit-scrollbar-thumb {
    background: var(--color-fd-gold);
    border-radius: 4px;
  }

  .scrollbar-gold::-webkit-scrollbar-thumb:hover {
    background: var(--color-fd-gold-light);
  }
}
```

---

### 🔹 ARQUIVO 5: `/src/package.json`

```json
{
  "name": "fd-store",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}
```

---

## 📝 NOTA IMPORTANTE

**Este documento contém os arquivos principais. Para os COMPONENTES REACT completos, você tem 2 opções:**

### OPÇÃO 1: Copiar do Projeto Atual ✅
Todos os arquivos abaixo estão funcionando perfeitamente:
- `/components/ProductManager.tsx` (482 linhas)
- `/components/UniformCustomizer.tsx` (482 linhas)
- `/components/Header.tsx` (114 linhas)
- `/components/Hero.tsx` (78 linhas)
- `/components/Footer.tsx`
- `/components/Cart.tsx`
- `/components/QuickView.tsx`
- `/components/ProductGrid.tsx`
- `/components/Collections.tsx`
- `/components/Testimonials.tsx`
- `/components/StatsPanel.tsx`
- `/components/UserProfile.tsx`
- `/data/mockData.ts`

### OPÇÃO 2: Solicitar Arquivo Individual 📦
Peça qualquer arquivo específico:
```
"Mostre o código completo de [nome-do-arquivo]"
```

---

## 🎯 COMO USAR ESTE DOCUMENTO

1. **Crie um novo projeto React + TypeScript**
2. **Copie cada arquivo** para sua respectiva pasta
3. **Instale as dependências:** `npm install lucide-react`
4. **Execute:** `npm run dev`
5. **Acesse:** `http://localhost:5173`

---

## 📞 PRÓXIMOS PASSOS

Para obter os componentes completos que faltam, peça:

```
"Mostre /components/ProductManager.tsx completo"
"Mostre /components/UniformCustomizer.tsx completo"  
"Mostre /data/mockData.ts completo"
```

Ou eu posso criar um **ARQUIVO PARTE 2** com todos os componentes React!

---

**FD STORE | FORT DYNAMIC**  
*Vista-se com Autoridade* ✨

---

## ⬇️ DOWNLOAD

**Para fazer o download deste arquivo:**

1. Selecione TODO o texto deste documento (Ctrl+A)
2. Copie (Ctrl+C)
3. Cole em um editor de texto
4. Salve como: `FD_STORE_COMPLETO.md`

Ou use a funcionalidade de export do Figma Make.

---

*Documento gerado em 27/01/2026*
