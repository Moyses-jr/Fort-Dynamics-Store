# 🚀 GUIA DE IMPLEMENTAÇÃO - FD STORE ECOSSISTEMA

## Para Desenvolvimento Real e Produção

Este guia fornece instruções passo a passo para transformar este protótipo em um sistema completo e funcional em produção.

---

## 📋 PRÉ-REQUISITOS

### Conhecimentos Necessários
- ✅ React e TypeScript
- ✅ Node.js e NPM
- ✅ Git e GitHub
- ✅ Conceitos de API REST
- ✅ Banco de dados SQL básico

### Ferramentas Necessárias
- Node.js 18+ instalado
- Editor de código (VS Code recomendado)
- Conta GitHub
- Conta Vercel/Netlify (deploy)
- Conta Supabase (backend)

---

## 🛠️ FASE 1: CONFIGURAÇÃO INICIAL

### 1.1 Setup do Projeto

```bash
# Criar novo projeto React + TypeScript + Vite
npm create vite@latest fdstore-ecosystem -- --template react-ts

# Entrar no diretório
cd fdstore-ecosystem

# Instalar dependências
npm install

# Instalar Tailwind CSS v4
npm install tailwindcss@next @tailwindcss/vite@next

# Instalar bibliotecas adicionais
npm install lucide-react
```

### 1.2 Configurar Tailwind

Criar `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

### 1.3 Estrutura de Pastas

Copie todos os arquivos deste protótipo para o projeto, mantendo a estrutura:
```
src/
├── components/
├── data/
├── types/
├── utils/
├── styles/
├── App.tsx
└── main.tsx
```

---

## 🗄️ FASE 2: CONFIGURAÇÃO DO BACKEND (SUPABASE)

### 2.1 Criar Conta Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Guarde a URL e as chaves do projeto

### 2.2 Instalar Cliente Supabase

```bash
npm install @supabase/supabase-js
```

### 2.3 Configurar Cliente Supabase

Criar arquivo `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Criar arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### 2.4 Criar Tabelas no Supabase

No SQL Editor do Supabase, execute:

```sql
-- Tabela de Produtos
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  images TEXT[],
  sizes TEXT[],
  colors JSONB,
  stamp_id UUID REFERENCES stamps(id),
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Estampas
CREATE TABLE stamps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Personagens IA
CREATE TABLE ai_characters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  style TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Usuários (estende auth.users do Supabase)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT,
  phone TEXT,
  cpf TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Endereços
CREATE TABLE addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Pedidos
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  shipping_address_id UUID REFERENCES addresses,
  tracking_code TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Itens do Pedido
CREATE TABLE order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders NOT NULL,
  product_id UUID REFERENCES products NOT NULL,
  customization JSONB,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Favoritos
CREATE TABLE favorites (
  user_id UUID REFERENCES auth.users,
  product_id UUID REFERENCES products,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id)
);

-- Tabela de Coleções
CREATE TABLE collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  theme TEXT NOT NULL,
  character_id UUID REFERENCES ai_characters,
  cover_image TEXT,
  ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Produtos em Coleções
CREATE TABLE collection_products (
  collection_id UUID REFERENCES collections,
  product_id UUID REFERENCES products,
  PRIMARY KEY (collection_id, product_id)
);

-- Habilitar Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajuste conforme necessário)
CREATE POLICY "Produtos são públicos" ON products FOR SELECT USING (true);
CREATE POLICY "Usuários veem seus próprios pedidos" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários veem seu próprio perfil" ON user_profiles FOR SELECT USING (auth.uid() = id);
```

---

## 🔐 FASE 3: AUTENTICAÇÃO

### 3.1 Implementar Login/Registro

Criar `src/hooks/useAuth.ts`:

```typescript
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  return { user, loading, signUp, signIn, signOut }
}
```

---

## 🤖 FASE 4: INTEGRAÇÃO DE IA

### 4.1 Configurar OpenAI

```bash
npm install openai
```

Adicionar ao `.env`:
```env
VITE_OPENAI_API_KEY=sk-sua-chave-aqui
```

### 4.2 Criar API Route para IA

Como Vite não tem API routes nativamente, você pode usar:

**Opção A: Vercel Serverless Functions**

Criar `api/generate-stamp.ts`:

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export default async function handler(req, res) {
  const { prompt } = req.body

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a t-shirt stamp design: ${prompt}. 
               Style: urban streetwear, black and gold colors, 
               high contrast, professional, transparent background`,
      size: "1024x1024",
      quality: "hd",
    })

    res.status(200).json({ imageUrl: response.data[0].url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
```

**Opção B: Supabase Edge Functions**

Criar função edge no Supabase para chamar a API do OpenAI.

---

## 💳 FASE 5: INTEGRAÇÃO DE PAGAMENTOS

### 5.1 Mercado Pago (Recomendado para Brasil)

```bash
npm install mercadopago
```

Adicionar ao `.env`:
```env
VITE_MERCADOPAGO_ACCESS_TOKEN=seu-token
```

### 5.2 Implementar PIX

```typescript
import mercadopago from 'mercadopago'

mercadopago.configure({
  access_token: process.env.VITE_MERCADOPAGO_ACCESS_TOKEN
})

export async function createPixPayment(amount: number, description: string) {
  const payment = await mercadopago.payment.create({
    transaction_amount: amount,
    description,
    payment_method_id: 'pix',
    payer: {
      email: 'cliente@email.com',
    }
  })

  return {
    qrCode: payment.body.point_of_interaction.transaction_data.qr_code,
    qrCodeBase64: payment.body.point_of_interaction.transaction_data.qr_code_base64,
    paymentId: payment.body.id,
  }
}
```

---

## 📦 FASE 6: CÁLCULO DE FRETE

### 6.1 Integração com Melhor Envio

```bash
npm install axios
```

```typescript
import axios from 'axios'

export async function calculateShipping(zipCode: string, products: any[]) {
  const response = await axios.post(
    'https://melhorenvio.com.br/api/v2/me/shipment/calculate',
    {
      from: { postal_code: '01000000' }, // CEP da loja
      to: { postal_code: zipCode },
      products: products.map(p => ({
        weight: 0.5, // kg
        width: 20,
        height: 5,
        length: 30,
        quantity: p.quantity,
      }))
    },
    {
      headers: {
        'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`
      }
    }
  )

  return response.data
}
```

---

## 📧 FASE 7: EMAILS TRANSACIONAIS

### 7.1 Configurar Resend/SendGrid

```bash
npm install resend
```

```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(
  email: string,
  orderData: any
) {
  await resend.emails.send({
    from: 'FD Store <pedidos@fdstore.com.br>',
    to: email,
    subject: `Pedido #${orderData.id} confirmado!`,
    html: `
      <h1>Obrigado pela sua compra!</h1>
      <p>Seu pedido foi confirmado e está sendo processado.</p>
      <p>Total: R$ ${orderData.total.toFixed(2)}</p>
    `
  })
}
```

---

## 🚀 FASE 8: DEPLOY

### 8.1 Deploy Frontend (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configurar variáveis de ambiente na Vercel:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_OPENAI_API_KEY
- etc.

### 8.2 Domínio Customizado

1. Comprar domínio (ex: fdstore.com.br)
2. Configurar DNS na Vercel
3. Configurar SSL automático

---

## 📊 FASE 9: ANALYTICS E MONITORAMENTO

### 9.1 Google Analytics

```bash
npm install react-ga4
```

```typescript
import ReactGA from 'react-ga4'

ReactGA.initialize('G-SEU-ID')

// Rastrear pageview
ReactGA.send({ hitType: "pageview", page: window.location.pathname })

// Rastrear evento
ReactGA.event({
  category: 'Ecommerce',
  action: 'Add to Cart',
  label: productName,
})
```

### 9.2 Sentry (Monitoramento de Erros)

```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "https://sua-dsn@sentry.io/projeto",
  environment: process.env.NODE_ENV,
})
```

---

## 🧪 FASE 10: TESTES

### 10.1 Setup de Testes

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### 10.2 Exemplo de Teste

```typescript
import { render, screen } from '@testing-library/react'
import { ProductCard } from './ProductCard'

test('renders product card with name and price', () => {
  const product = {
    id: '1',
    name: 'Camiseta Test',
    basePrice: 99.90,
    // ... outros campos
  }

  render(<ProductCard product={product} {...otherProps} />)
  
  expect(screen.getByText('Camiseta Test')).toBeInTheDocument()
  expect(screen.getByText('R$ 99.90')).toBeInTheDocument()
})
```

---

## 🔒 FASE 11: SEGURANÇA

### Checklist de Segurança

- [ ] HTTPS habilitado
- [ ] Variáveis sensíveis em .env (nunca no código)
- [ ] Row Level Security no Supabase configurado
- [ ] Validação de inputs no frontend e backend
- [ ] Rate limiting nas APIs
- [ ] CORS configurado corretamente
- [ ] Sanitização de dados do usuário
- [ ] Autenticação em todas as rotas protegidas

---

## 📱 FASE 12: APP MOBILE (OPCIONAL)

### 12.1 React Native / Expo

```bash
npx create-expo-app fdstore-mobile
cd fdstore-mobile
npm install
```

Reutilizar:
- Lógica de negócio (utils, hooks)
- Tipos TypeScript
- Integração com Supabase
- Componentes (adaptar para React Native)

---

## 🎯 CHECKLIST FINAL DE PRODUÇÃO

### Antes de Lançar

- [ ] Testes em múltiplos dispositivos
- [ ] Performance otimizada (Lighthouse > 90)
- [ ] SEO configurado (meta tags, sitemap)
- [ ] Favicon e imagens OG
- [ ] Política de Privacidade e Termos de Uso
- [ ] Sistema de backup configurado
- [ ] Monitoramento de uptime
- [ ] Processo de CI/CD configurado
- [ ] Documentação atualizada
- [ ] Treinamento da equipe

### Compliance

- [ ] LGPD compliance (Brasil)
- [ ] Cookie consent
- [ ] Termos de uso aceitos no cadastro
- [ ] Política de devolução clara
- [ ] Dados de CNPJ e contato visíveis

---

## 💰 ESTIMATIVA DE CUSTOS MENSAIS

### Plano Inicial (Startup)

| Serviço | Custo/Mês |
|---------|-----------|
| Supabase (Pro) | $25 |
| Vercel (Pro) | $20 |
| OpenAI API | $20-100 (uso) |
| Mercado Pago | % transação |
| Melhor Envio | Frete cliente |
| Domínio | $10/ano |
| **Total** | **~$65-145** |

### Plano Crescimento

| Serviço | Custo/Mês |
|---------|-----------|
| Supabase (Team) | $599 |
| Vercel (Team) | $20 |
| OpenAI API | $200-500 |
| Infraestrutura Extra | $100 |
| **Total** | **~$919-1219** |

---

## 📚 RECURSOS ADICIONAIS

### Documentação Oficial
- [React](https://react.dev)
- [Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Mercado Pago](https://www.mercadopago.com.br/developers)

### Comunidades
- Discord React Brasil
- Supabase Discord
- Stack Overflow

### Cursos Recomendados
- React Avançado
- TypeScript Completo
- Node.js e APIs REST
- Supabase Masterclass

---

## 🆘 SUPORTE E MANUTENÇÃO

### Rotina de Manutenção

**Diária:**
- Verificar pedidos pendentes
- Responder clientes
- Monitorar erros (Sentry)

**Semanal:**
- Atualizar estoque
- Análise de métricas
- Backup manual

**Mensal:**
- Atualizar dependências
- Review de segurança
- Otimização de performance

---

## ✅ CONCLUSÃO

Este guia fornece o caminho completo para transformar o protótipo FD Store em um sistema de produção robusto e escalável.

**Próximos Passos Sugeridos:**
1. Implementar backend (Fase 2)
2. Autenticação (Fase 3)
3. Deploy básico (Fase 8)
4. IA e Pagamentos (Fases 4-5)
5. Otimizações e features avançadas

**Lembre-se:**
- Comece pequeno, itere rápido
- Priorize funcionalidades essenciais
- Teste com usuários reais cedo
- Mantenha código limpo e documentado

**BOA SORTE COM O LANÇAMENTO DA FD STORE! 🚀**
