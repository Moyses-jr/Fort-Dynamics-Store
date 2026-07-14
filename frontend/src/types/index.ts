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
  favorites: string[]; // Product IDs
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
