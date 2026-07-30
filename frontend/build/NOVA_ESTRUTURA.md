# 🎯 NOVA ESTRUTURA FD STORE

## 📋 Reorganização Completa

### ✅ ANTES
- Produtos misturados sem separação clara
- Uniformes e linha de moda no mesmo lugar
- Sem sistema de gerenciamento de produtos

### ✨ AGORA

---

## 1️⃣ LINHA DE MODA (Produtos Prontos)

**Localização:** Seção `#produtos`

### Funcionalidades:
✅ **Gerenciamento Completo de Produtos**
- Botão "Gerenciar Produtos" para abrir painel de administração
- Adicionar novos produtos facilmente
- Editar produtos existentes
- Excluir produtos

✅ **Variedades Configuráveis:**
- **Modelos:** Básica, Polo, Oversized, etc.
- **Cores:** Múltiplas opções de cor
- **Tipos de Tecido:** 100% Algodão, Piquet Premium, Moletom, etc.
- **Tamanhos:** PP, P, M, G, GG, XG, XXG
- **Preços:** Editáveis individualmente

### Produtos Pré-Configurados:

#### CAMISETAS:
1. **Camiseta Básica** - R$ 99,90
   - 100% Algodão
   - Cores: Preto, Branco
   - Tamanhos: PP ao XG

2. **Camiseta Polo** - R$ 149,90
   - Piquet Premium
   - Cores: Preto, Branco, Cinza
   - Tamanhos: P ao XG

3. **Camiseta Oversized** - R$ 119,90
   - Algodão 30.1
   - Cores: Preto, Branco Off
   - Tamanhos: M ao XG

#### MOLETONS:
1. **Moletom Básico** - R$ 199,90
   - Moletom 70% Algodão
   - Cores: Preto, Cinza Chumbo
   - Tamanhos: P ao XG

2. **Moletom com Capuz** - R$ 249,90
   - Moletom Premium
   - Cores: Preto, Cinza
   - Tamanhos: P ao XG

---

## 2️⃣ UNIFORMES PERSONALIZADOS

**Localização:** Seção `#uniformes`

### Funcionalidades:
✅ **Upload de Arte**
- Faça upload de qualquer imagem (PNG, JPG, SVG)
- Preview em tempo real

✅ **Mockups Lisos**
- Camiseta Básica Lisa - R$ 89,90
- Moletom Liso - R$ 179,90
- Polo Lisa - R$ 129,90

✅ **Controles de Customização:**
- **Tamanho da Arte:** Slider 50% - 150%
- **Rotação:** 0° - 360°
- **Posição:** Ajustável
- **Cor do Tecido:** 5 opções (Preto, Branco, Cinza, Azul Marinho, Verde Musgo)

✅ **Seleção de Produto:**
- Escolha entre os mockups disponíveis
- Visualização instantânea da arte aplicada
- Preview realista do produto final

✅ **Opções de Compra:**
- Seleção de tamanho (PP ao XXG)
- Quantidade ajustável
- Cálculo automático do total
- Download do mockup em alta resolução
- Adicionar ao carrinho

### Benefícios Destacados:
- 🎨 Produção Profissional
- 📦 Pedidos em Quantidade (descontos progressivos)
- ✅ Aprovação de Arte pela equipe

---

## 3️⃣ AI STUDIO (Gerador de Estampas)

**Localização:** Seção `#personalizar`

Mantém todas as funcionalidades originais de geração de estampas e personagens por IA.

---

## 🎯 FLUXO DO USUÁRIO

### Para Comprar da Linha de Moda:
1. Acessa seção "LINHA DE MODA"
2. Escolhe entre Camisetas ou Moletons
3. Vê modelos, cores, tecidos e preços
4. Adiciona ao carrinho (futura integração)

### Para Personalizar Uniformes:
1. Acessa seção "UNIFORMES PERSONALIZADOS"
2. Escolhe o mockup (camiseta, moletom, polo)
3. Faz upload da arte
4. Ajusta tamanho, rotação e posição
5. Seleciona cor do tecido
6. Escolhe tamanho e quantidade
7. Adiciona ao carrinho

### Para Administrador (Linha de Moda):
1. Clica em "Gerenciar Produtos"
2. Visualiza todos os produtos
3. Edita produtos existentes
4. Adiciona novos modelos
5. Configura preços, cores, tecidos
6. Salva alterações

---

## 🔧 COMPONENTES CRIADOS

### `/components/ProductManager.tsx`
Sistema completo de gerenciamento da Linha de Moda com interface de administração.

### `/components/UniformCustomizer.tsx`
Customizador de uniformes com upload de imagens, mockups e preview em tempo real.

---

## 📱 RESPONSIVIDADE

Todos os componentes são 100% responsivos:
- Mobile: Layout em coluna única
- Tablet: Grid 2 colunas
- Desktop: Grid 3 colunas

---

## 🎨 IDENTIDADE VISUAL

Mantém o padrão FD Store:
- Cores: Preto (#000), Branco (#fff), Dourado (#d4af37)
- Estilo moderno, urbano e autoritário
- Animações suaves e transições elegantes
