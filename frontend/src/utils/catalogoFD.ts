// FD STORE - Catálogo Completo de Produtos
// =====================================================
// GUIA DE IMAGENS — Como adicionar imagens reais:
// =====================================================
// Cada produto tem um campo "image" com a URL da foto.
// Para trocar por sua própria imagem, você tem 3 opções:
//
// OPÇÃO 1 — Hospedagem gratuita (mais fácil):
//   1. Acesse https://imgur.com ou https://postimages.org
//   2. Faça upload da foto do seu produto
//   3. Copie o link direto (termina em .jpg ou .png)
//   4. Cole no campo image: 'COLE_AQUI_O_LINK'
//
// OPÇÃO 2 — Google Drive:
//   1. Faça upload no Drive e torne o arquivo público
//   2. Pegue o ID do arquivo (está na URL)
//   3. Use: https://drive.google.com/uc?export=view&id=SEU_ID
//
// OPÇÃO 3 — Unsplash (fotos de estoque gratuitas):
//   Acesse unsplash.com, busque "blank tshirt", copie o link da foto
// =====================================================

export interface ProductFD {
  id: string;
  category: 'camisetas' | 'moletons';
  name: string;
  type: string;
  fabric: string;
  description: string;
  prices: {
    fronteVerso: number;
    frente: number;
    verso: number;
  };
  // 👇 CAMPO DE IMAGEM — troque a URL pela foto real do produto
  image: string;
  available: boolean;
  minQuantity?: number;
  requiresBudget?: boolean;
  obs?: string;
  badge?: string; // ex: 'MAIS VENDIDO', 'NOVO', 'PREMIUM'
}

export const catalogoFD: ProductFD[] = [
  // ===== CAMISETAS =====
  {
    id: 'cam-001',
    category: 'camisetas',
    name: 'Camiseta Básica',
    type: 'Básica',
    fabric: 'Fio 30.1 Penteado',
    description: 'Camiseta de algodão Fio 30.1 penteado. Personalização em DTF.',
    prices: {
      fronteVerso: 67.00,
      frente: 55.00,
      verso: 60.00,
    },
    // 👇 Troque este link pela foto real da Camiseta Básica
    image: 'https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?w=800',
    available: true,
    obs: 'Personalização em DTF',
    badge: 'MAIS VENDIDO',
  },
  {
    id: 'cam-002',
    category: 'camisetas',
    name: 'Camiseta Plus',
    type: 'Plus',
    fabric: 'Pima Plus Peruano',
    description: 'Camiseta de algodão Pima Plus Peruano. Toque suave e premium.',
    prices: {
      fronteVerso: 87.00,
      frente: 65.00,
      verso: 80.00,
    },
    // 👇 Troque este link pela foto real da Camiseta Plus
    image: 'https://images.unsplash.com/photo-1642761589121-ec47d4c425ae?w=800',
    available: true,
  },
  {
    id: 'cam-003',
    category: 'camisetas',
    name: 'Camiseta Premium',
    type: 'Premium',
    fabric: 'Com Elastano Premium Egípcio',
    description: 'Camiseta de algodão com elastano premium Egípcio. Caimento impecável.',
    prices: {
      fronteVerso: 127.00,
      frente: 110.00,
      verso: 115.00,
    },
    // 👇 Troque este link pela foto real da Camiseta Premium
    image: 'https://images.unsplash.com/photo-1711355249709-1733df63e028?w=800',
    available: true,
    badge: 'PREMIUM',
  },
];

// Cores disponíveis para todos os produtos
export const coresDisponiveis = [
  { name: 'Preto', hex: '#000000' },
  { name: 'Branco', hex: '#ffffff' },
  { name: 'Cinza', hex: '#808080' },
  { name: 'Cinza Mescla', hex: '#9CA3AF' },
  { name: 'Azul Marinho', hex: '#001f3f' },
  { name: 'Verde Musgo', hex: '#4a5d23' },
  { name: 'Vinho', hex: '#6B2D2D' },
  { name: 'Amarelo FD', hex: '#F5C542' },
];

// Tamanhos disponíveis
export const tamanhosDisponiveis = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'];

// Opções de personalização
export const opcoesPersonalizacao = [
  { id: 'frente-verso', label: 'Frente e Verso', key: 'fronteVerso' as const },
  { id: 'frente', label: 'Somente Frente', key: 'frente' as const },
  { id: 'verso', label: 'Somente Verso', key: 'verso' as const },
];
