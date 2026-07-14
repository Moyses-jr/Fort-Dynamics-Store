# FD STORE | FORT DYNAMIC - DOCUMENTAÇÃO TÉCNICA COMPLETA

## 📋 ÍNDICE

1. [Visão Geral do Ecossistema](#visão-geral-do-ecossistema)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Estrutura de Dados](#estrutura-de-dados)
4. [Componentes Principais](#componentes-principais)
5. [Sistema de IA](#sistema-de-ia)
6. [Fluxos de Usuário](#fluxos-de-usuário)
7. [APIs e Integrações](#apis-e-integrações)
8. [Guia de Desenvolvimento](#guia-de-desenvolvimento)

---

## 🎯 VISÃO GERAL DO ECOSSISTEMA

### Objetivo
Criar um ecossistema digital completo que une e-commerce, personalização por IA, e experiência premium para a marca FD STORE | Fort Dynamic.

### Componentes do Ecossistema

```
FD STORE ECOSYSTEM
│
├── 🛍️ E-COMMERCE (Site Principal)
│   ├── Catálogo de Produtos
│   ├── Sistema de Carrinho
│   ├── Checkout e Pagamentos
│   └── Área do Cliente
│
├── 🎨 PERSONALIZADOR (Customizer)
│   ├── Seleção de Tamanho/Cor
│   ├── Escolha de Estampas
│   ├── Adição de Personagens
│   └── Prévia 3D
│
├── 🤖 IA STUDIO
│   ├── Gerador de Estampas
│   ├── Gerador de Personagens
│   ├── Sistema de Recomendações
│   └── Criador de Coleções Automático
│
├── 📦 BANCO DE DADOS
│   ├── Produtos e Catálogo
│   ├── Estampas (Padrão + IA)
│   ├── Personagens IA
│   ├── Coleções
│   ├── Usuários e Pedidos
│   └── Analytics
│
└── 👤 ÁREA DO CLIENTE
    ├── Perfil
    ├── Pedidos e Rastreamento
    ├── Favoritos
    └── Endereços
```

---

## 🏗️ ARQUITETURA DO SISTEMA

### Stack Tecnológico

```typescript
Frontend:
- React 18+ (Hooks, Context API)
- TypeScript (Type Safety)
- Tailwind CSS v4.0 (Estilização)
- Lucide React (Ícones)

Design System:
- Cores: #000000 (preto), #FFFFFF (branco), #D4AF37 (dourado)
- Tipografia: Bebas Neue (display), Inter (corpo)
- Componentes reutilizáveis

Backend (Sugestão para produção):
- Supabase / Firebase
- PostgreSQL (Banco de dados)
- Storage para imagens
- Authentication

IA (Simulado - Produção requer APIs reais):
- OpenAI DALL-E / Midjourney (Geração de imagens)
- Stable Diffusion (Alternativa open-source)
- TensorFlow.js (Recomendações client-side)
```

### Estrutura de Pastas

```
/
├── /components          # Componentes React
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── Customizer.tsx
│   ├── Cart.tsx
│   ├── Collections.tsx
│   ├── AIStudio.tsx
│   ├── Testimonials.tsx
│   ├── Footer.tsx
│   ├── QuickView.tsx
│   └── UserProfile.tsx
│
├── /data               # Dados mock e seeders
│   └── mockData.ts
│
├── /types              # TypeScript types
│   └── index.ts
│
├── /utils              # Utilitários e helpers
│   └── aiEngine.ts     # Motor de IA (simulação)
│
├── /styles             # Estilos globais
│   └── globals.css
│
└── App.tsx            # Componente principal
```

---

## 📊 ESTRUTURA DE DADOS

### Entidades Principais

#### 1. Product (Produto)
```typescript
Product {
  id: string
  name: string
  category: 'camisetas' | 'moletons' | 'uniformes' | 'premium'
  description: string
  basePrice: number
  images: string[]
  sizes: ['PP', 'P', 'M', 'G', 'GG', 'XG']
  colors: ProductColor[]
  stamp?: Stamp
  available: boolean
  featured: boolean
  isNew: boolean
  isPremium: boolean
  stockQuantity: number
  tags: string[]
  createdAt: Date
}
```

#### 2. Stamp (Estampa)
```typescript
Stamp {
  id: string
  name: string
  imageUrl: string
  category: 'street' | 'minimal' | 'sport' | 'premium' | 'custom'
  tags: string[]
  aiGenerated: boolean
  createdAt: Date
}
```

#### 3. AICharacter (Personagem IA)
```typescript
AICharacter {
  id: string
  name: string
  imageUrl: string
  style: 'urban' | 'futuristic' | 'classic' | 'dynamic' | 'premium'
  description: string
  tags: string[]
  usageCount: number
  createdAt: Date
}
```

#### 4. Collection (Coleção)
```typescript
Collection {
  id: string
  name: string
  description: string
  theme: 'street' | 'futuristic' | 'dynamic' | 'premium'
  products: Product[]
  character?: AICharacter
  stamps: Stamp[]
  coverImage: string
  aiGenerated: boolean
  createdAt: Date
}
```

#### 5. Order (Pedido)
```typescript
Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  shippingCost: number
  status: 'pending' | 'confirmed' | 'production' | 'shipping' | 'delivered'
  paymentMethod: 'pix' | 'card' | 'boleto'
  paymentStatus: 'pending' | 'paid' | 'failed'
  shippingAddress: Address
  trackingCode?: string
  createdAt: Date
  updatedAt: Date
}
```

### Relações entre Entidades

```
User 1───────* Order
User 1───────* Address
User *───────* Product (favoritos)

Order 1──────* CartItem
CartItem *───1 Product
CartItem *───? Stamp
CartItem *───? AICharacter

Collection *─* Product
Collection *─* Stamp
Collection *─1 AICharacter
```

---

## 🧩 COMPONENTES PRINCIPAIS

### 1. Header
**Responsabilidade:** Navegação principal, carrinho, login

**Props:**
```typescript
{
  cartItemsCount: number
  onCartClick: () => void
  onLoginClick: () => void
  isLoggedIn: boolean
}
```

**Funcionalidades:**
- Menu de navegação responsivo
- Busca de produtos
- Ícone de carrinho com contador
- Acesso à área do cliente

---

### 2. ProductCard
**Responsabilidade:** Exibir produto individual no grid

**Props:**
```typescript
{
  product: Product
  onQuickView: (product) => void
  onAddToCart: (product) => void
  onToggleFavorite: (productId) => void
  isFavorite: boolean
}
```

**Funcionalidades:**
- Exibir imagem, nome, preço
- Badges (Novo, Premium)
- Hover effects (zoom, ações rápidas)
- Favoritar produto
- Adicionar ao carrinho rápido

---

### 3. Customizer
**Responsabilidade:** Personalização completa de produtos

**Props:**
```typescript
{
  product: Product
  onAddToCart: (customization) => void
  availableStamps: Stamp[]
  availableCharacters: AICharacter[]
}
```

**Funcionalidades:**
- Seleção de tamanho
- Seleção de cor
- Escolha de estampa (catálogo/upload/IA)
- Escolha de personagem
- Controle de quantidade
- Prévia 3D
- Cálculo de preço dinâmico

**Fórmula de Preço:**
```
Preço Final = (Preço Base + Taxa Estampa IA + Taxa Personagem) × Quantidade

Taxa Estampa IA: R$ 30,00
Taxa Personagem: R$ 20,00
```

---

### 4. AIStudio
**Responsabilidade:** Criação de estampas e personagens com IA

**Props:**
```typescript
{
  onStampCreated: (stamp: Stamp) => void
  onCharacterCreated: (character: AICharacter) => void
}
```

**Funcionalidades:**
- Tab de geração de estampas
- Tab de geração de personagens
- Input de prompt/descrição
- Preview em tempo real
- Download/compartilhamento

**Fluxo de Geração:**
```
1. Usuário descreve o que quer
2. Sistema processa prompt
3. IA gera imagem (simulado - 2-3 segundos)
4. Preview é exibido
5. Usuário pode usar na personalização
```

---

### 5. Cart
**Responsabilidade:** Gerenciar carrinho de compras

**Funcionalidades:**
- Listar produtos adicionados
- Atualizar quantidade
- Remover itens
- Calcular subtotal, frete, total
- Frete grátis acima de R$ 299
- Checkout

---

### 6. Collections
**Responsabilidade:** Exibir coleções temáticas

**Funcionalidades:**
- Grid de coleções
- Badge de IA para coleções geradas
- Preview de personagem associado
- Contagem de produtos
- Preço inicial

---

## 🤖 SISTEMA DE IA

### Módulos de IA

#### 1. Gerador de Estampas
**Arquivo:** `/utils/aiEngine.ts`

**Função:** `generateStampWithAI(prompt: string)`

**Input:**
```typescript
prompt: "Leão dourado com coroa, estilo minimalista"
```

**Output:**
```typescript
Stamp {
  id: "stamp-ai-1234567890",
  name: "LEÃO DOURADO COM CO",
  imageUrl: "[URL da imagem gerada]",
  category: "custom",
  tags: ["ai-generated", "leão", "dourado", "coroa"],
  aiGenerated: true,
  createdAt: Date
}
```

**Implementação Real (Produção):**
```typescript
// Usando OpenAI DALL-E
const response = await openai.images.generate({
  model: "dall-e-3",
  prompt: `Create a t-shirt stamp design: ${prompt}. 
           Style: urban streetwear, black and gold colors, 
           high contrast, transparent background`,
  size: "1024x1024",
  quality: "hd",
});

return response.data[0].url;
```

---

#### 2. Gerador de Personagens
**Função:** `generateCharacterWithAI(style, description)`

**Input:**
```typescript
style: "urban"
description: "Guerreiro urbano com atitude autoritária"
```

**Output:**
```typescript
AICharacter {
  id: "char-ai-1234567890",
  name: "AI URBAN CHARACTER",
  imageUrl: "[URL]",
  style: "urban",
  description: "Guerreiro urbano...",
  tags: ["urban", "ai-generated", "custom"],
  usageCount: 0,
  createdAt: Date
}
```

---

#### 3. Sistema de Recomendações
**Função:** `getAIRecommendations(userId, userHistory, allProducts, allCollections)`

**Algoritmo:**
```typescript
1. Analisa histórico de compras do usuário
2. Identifica categorias e tags preferidas
3. Filtra produtos similares
4. Calcula score de relevância
5. Retorna top 6 produtos + 3 coleções
```

**Fórmula de Score:**
```
Score = (Similaridade de Categoria × 0.4) +
        (Match de Tags × 0.3) +
        (Popularidade × 0.2) +
        (Novidade × 0.1)
```

---

#### 4. Gerador Automático de Coleções
**Função:** `generateCollectionWithAI(theme, products, character, stamps)`

**Input:**
```typescript
theme: "street"
products: [Product1, Product2, Product3]
character: AICharacter
stamps: [Stamp1, Stamp2]
```

**Output:**
```typescript
Collection {
  id: "col-ai-1234567890",
  name: "STREET COLLECTION",
  description: "Coleção urbana com atitude...",
  theme: "street",
  products: [...],
  character: {...},
  stamps: [...],
  coverImage: "[URL]",
  aiGenerated: true,
  createdAt: Date
}
```

---

## 👤 FLUXOS DE USUÁRIO

### Fluxo 1: Compra Simples
```
1. Usuário acessa o site
2. Navega pelo catálogo
3. Clica em um produto
4. Seleciona tamanho e cor
5. Adiciona ao carrinho
6. Continua comprando ou vai ao checkout
7. Preenche endereço de entrega
8. Escolhe forma de pagamento
9. Confirma pedido
10. Recebe código de rastreamento
```

### Fluxo 2: Personalização Completa
```
1. Usuário acessa "Personalizar"
2. Escolhe o produto base
3. Seleciona tamanho e cor
4. Acessa IA Studio
5. Gera estampa customizada com IA
   - Descreve o que quer
   - IA gera a imagem
   - Preview aparece
6. Escolhe personagem (opcional)
7. Visualiza prévia 3D
8. Adiciona ao carrinho
9. Finaliza compra
```

### Fluxo 3: Criação com IA
```
1. Usuário acessa IA Studio
2. Escolhe entre Estampa ou Personagem
3. Preenche descrição/prompt
4. IA processa e gera
5. Usuário visualiza resultado
6. Pode baixar, compartilhar ou usar em produto
7. Item é salvo na biblioteca do usuário
```

### Fluxo 4: Área do Cliente
```
1. Usuário faz login
2. Acessa "Minha Conta"
3. Visualiza:
   - Pedidos em andamento
   - Histórico de compras
   - Favoritos
   - Endereços salvos
4. Pode:
   - Rastrear pedidos
   - Solicitar troca/devolução
   - Gerenciar dados pessoais
```

---

## 🔌 APIs E INTEGRAÇÕES

### APIs Necessárias (Produção)

#### 1. API de Produtos
```typescript
GET    /api/products          // Lista todos
GET    /api/products/:id      // Detalhes
GET    /api/products/category/:category
POST   /api/products          // Admin: criar
PUT    /api/products/:id      // Admin: editar
DELETE /api/products/:id      // Admin: deletar
```

#### 2. API de Pedidos
```typescript
POST   /api/orders            // Criar pedido
GET    /api/orders/:id        // Detalhes
GET    /api/orders/user/:userId
PUT    /api/orders/:id/status // Atualizar status
```

#### 3. API de IA
```typescript
POST   /api/ai/generate-stamp
POST   /api/ai/generate-character
POST   /api/ai/3d-preview
GET    /api/ai/recommendations/:userId
```

#### 4. API de Pagamentos
```typescript
POST   /api/payments/pix      // Gerar QR Code PIX
POST   /api/payments/card     // Processar cartão
POST   /api/payments/boleto   // Gerar boleto
GET    /api/payments/:id/status
```

#### 5. API de Frete
```typescript
POST   /api/shipping/calculate  // Calcula frete
POST   /api/shipping/track      // Rastreamento
```

---

### Integrações Externas Sugeridas

#### Pagamentos
- **Mercado Pago:** Completo (PIX, cartão, boleto)
- **Stripe:** Internacional
- **PagSeguro:** Nacional

#### Frete
- **Melhor Envio:** Multi-transportadoras
- **Correios API:** Frete tradicional
- **Loggi:** Entregas rápidas

#### IA
- **OpenAI DALL-E 3:** Geração de imagens premium
- **Stable Diffusion API:** Open-source alternativa
- **Replicate:** Hosting de modelos IA

#### Analytics
- **Google Analytics 4:** Tracking comportamental
- **Hotjar:** Mapas de calor
- **Mixpanel:** Analytics de produto

---

## 💻 GUIA DE DESENVOLVIMENTO

### Instalação e Setup

```bash
# 1. Clonar repositório
git clone https://github.com/fdstore/ecosystem

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env

# 4. Executar em desenvolvimento
npm run dev

# 5. Build para produção
npm run build
```

### Variáveis de Ambiente (Produção)

```env
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...

# IA Services
OPENAI_API_KEY=sk-...
REPLICATE_API_TOKEN=...

# Payments
MERCADOPAGO_ACCESS_TOKEN=...
STRIPE_SECRET_KEY=...

# Storage
AWS_S3_BUCKET=...
AWS_ACCESS_KEY=...

# Email
SENDGRID_API_KEY=...
```

---

### Extensões Futuras

#### 1. App Mobile (React Native)
- Mesma base de código
- Expo para desenvolvimento rápido
- Push notifications

#### 2. Painel Administrativo Completo
- Dashboard analytics
- Gestão de produtos
- Gestão de pedidos
- Sistema de estoque
- Relatórios financeiros

#### 3. Sistema de Afiliados
- Links de referência
- Comissões automáticas
- Dashboard de afiliados

#### 4. Programa de Fidelidade
- Pontos por compra
- Níveis VIP
- Cashback

#### 5. Realidade Aumentada (AR)
- Experimentar roupas virtualmente
- Three.js / WebXR
- Integração com câmera

---

## 📈 MÉTRICAS E KPIs

### Métricas de Negócio
- **Taxa de Conversão:** Visitantes → Compradores
- **Ticket Médio:** Valor médio por pedido
- **LTV:** Lifetime Value do cliente
- **CAC:** Custo de Aquisição de Cliente
- **Churn Rate:** Taxa de abandono

### Métricas de Produto
- **Tempo no Site:** Engajamento
- **Taxa de Abandono de Carrinho**
- **Uso de Personalização IA:** % de pedidos custom
- **Taxa de Recompra**
- **NPS:** Net Promoter Score

### Métricas Técnicas
- **Performance:** Core Web Vitals
- **Disponibilidade:** Uptime 99.9%
- **Latência API:** < 200ms
- **Tempo de Carregamento:** < 3s

---

## 🚀 ROADMAP DE IMPLEMENTAÇÃO

### Fase 1: MVP (4-6 semanas)
- [x] Design System
- [x] Catálogo de produtos
- [x] Carrinho de compras
- [x] Sistema de personalização básica
- [ ] Integração de pagamento (PIX)
- [ ] Deploy inicial

### Fase 2: IA (4 semanas)
- [x] Interface IA Studio
- [ ] Integração OpenAI DALL-E
- [ ] Sistema de recomendações
- [ ] Gerador de coleções automático

### Fase 3: E-commerce Completo (6 semanas)
- [ ] Autenticação de usuários
- [ ] Área do cliente completa
- [ ] Sistema de pedidos e rastreamento
- [ ] Admin panel
- [ ] Email transacional

### Fase 4: Escala (Ongoing)
- [ ] App Mobile
- [ ] AR Try-on
- [ ] Programa de fidelidade
- [ ] Internacionalização

---

## 📝 CONCLUSÃO

Este ecossistema FD STORE foi projetado para ser:

✅ **Escalável:** Arquitetura modular  
✅ **Performático:** Otimizado para web  
✅ **Inovador:** IA integrada  
✅ **Premium:** UX de alta qualidade  
✅ **Completo:** Do catálogo ao pós-venda  

Para desenvolvimento real em produção, recomenda-se:
1. Implementar backend robusto (Supabase/Firebase)
2. Integrar APIs de IA reais
3. Adicionar testes automatizados (Jest, Cypress)
4. Implementar CI/CD
5. Monitoramento e observabilidade
