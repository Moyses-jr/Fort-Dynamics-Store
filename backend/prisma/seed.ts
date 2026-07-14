// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // ── Categorias ──────────────────────────────────────────────
  const camisetas = await prisma.category.upsert({
    where: { slug: 'camisetas' },
    update: {},
    create: { name: 'Camisetas', slug: 'camisetas', description: 'Camisetas personalizadas' },
  })

  const moletons = await prisma.category.upsert({
    where: { slug: 'moletons' },
    update: {},
    create: { name: 'Moletons', slug: 'moletons', description: 'Moletons personalizados' },
  })

  console.log('✅ Categorias criadas')

  // ── Produtos ────────────────────────────────────────────────
  const produtos = [
    {
      categoryId: camisetas.id,
      name: 'Camiseta Básica',
      slug: 'camiseta-basica',
      description: 'Camiseta de algodão Fio 30.1 penteado. Personalização em DTF.',
      fabricType: 'Fio 30.1 Penteado',
      priceFront: 55.0,
      priceBack: 60.0,
      priceBoth: 67.0,
      badge: 'MAIS VENDIDO',
      available: true,
      isFeatured: true,
      isNew: false,
      isPremium: false,
      images: ['https://images.unsplash.com/photo-1610502778270-c5c6f4c7d575?w=800'],
      colors: ['Preto', 'Branco', 'Cinza'],
      sizes: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'],
      stock: 20,
    },
    {
      categoryId: camisetas.id,
      name: 'Camiseta Plus',
      slug: 'camiseta-plus',
      description: 'Camiseta de algodão Pima Plus Peruano. Toque suave e premium.',
      fabricType: 'Pima Plus Peruano',
      priceFront: 65.0,
      priceBack: 80.0,
      priceBoth: 87.0,
      badge: null,
      available: true,
      isFeatured: false,
      isNew: true,
      isPremium: false,
      images: ['https://images.unsplash.com/photo-1642761589121-ec47d4c425ae?w=800'],
      colors: ['Preto', 'Branco'],
      sizes: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'],
      stock: 15,
    },
    {
      categoryId: camisetas.id,
      name: 'Camiseta Premium',
      slug: 'camiseta-premium',
      description: 'Camiseta de algodão com elastano premium Egípcio. Caimento impecável.',
      fabricType: 'Com Elastano Premium Egípcio',
      priceFront: 110.0,
      priceBack: 115.0,
      priceBoth: 127.0,
      badge: 'PREMIUM',
      available: true,
      isFeatured: true,
      isNew: false,
      isPremium: true,
      images: ['https://images.unsplash.com/photo-1711355249709-1733df63e028?w=800'],
      colors: ['Preto', 'Branco', 'Cinza Mescla'],
      sizes: ['P', 'M', 'G', 'GG', 'XG'],
      stock: 10,
    },
    {
      categoryId: camisetas.id,
      name: 'Camiseta Oversized',
      slug: 'camiseta-oversized',
      description: 'Camiseta de algodão Pro Suedine. Corte oversized, estilo urbano.',
      fabricType: 'Pro Suedine',
      priceFront: 100.0,
      priceBack: 107.0,
      priceBoth: 117.0,
      badge: 'TENDÊNCIA',
      available: true,
      isFeatured: true,
      isNew: true,
      isPremium: false,
      images: ['https://images.unsplash.com/photo-1714802576341-c366e9347032?w=800'],
      colors: ['Preto', 'Branco Off'],
      sizes: ['M', 'G', 'GG', 'XG'],
      stock: 12,
    },
    {
      categoryId: camisetas.id,
      name: 'Camiseta Polo',
      slug: 'camiseta-polo',
      description: 'Camiseta polo de malha Piquê. Elegância e conforto.',
      fabricType: 'Malha Piquê',
      priceFront: 75.0,
      priceBack: 87.0,
      priceBoth: 95.0,
      badge: null,
      available: true,
      isFeatured: false,
      isNew: false,
      isPremium: false,
      images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800'],
      colors: ['Preto', 'Branco', 'Azul Marinho'],
      sizes: ['P', 'M', 'G', 'GG', 'XG'],
      stock: 18,
    },
    {
      categoryId: camisetas.id,
      name: 'Camiseta Poliéster',
      slug: 'camiseta-poliester',
      description: 'Camiseta básica de malha poliéster. Ideal para uniformes.',
      fabricType: 'Malha Poliéster',
      priceFront: 50.0,
      priceBack: 57.0,
      priceBoth: 65.0,
      badge: null,
      available: true,
      isFeatured: false,
      isNew: false,
      isPremium: false,
      images: ['https://images.unsplash.com/photo-1720514496161-914011a9ee02?w=800'],
      colors: ['Preto', 'Branco', 'Cinza', 'Azul Marinho'],
      sizes: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'],
      stock: 30,
    },
    {
      categoryId: camisetas.id,
      name: 'Camiseta Dryfit',
      slug: 'camiseta-dryfit',
      description: 'Camiseta esportiva na malha Dryfit. Sublimação. Mín. 10 unidades.',
      fabricType: 'Malha Dryfit',
      priceFront: 0,
      priceBack: 0,
      priceBoth: 0,
      requiresBudget: true,
      obs: 'Somente acima de 10 unidades — sujeito a avaliação de orçamento',
      badge: 'SOB ORÇAMENTO',
      available: true,
      isFeatured: false,
      isNew: false,
      isPremium: false,
      images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800'],
      colors: ['Preto', 'Branco'],
      sizes: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'XXG'],
      stock: 999,
    },
    {
      categoryId: moletons.id,
      name: 'Moletom Careca',
      slug: 'moletom-careca',
      description: 'Moletom Careca com malha Soft. Sem capuz, casual e confortável.',
      fabricType: 'Malha Soft',
      priceFront: 145.0,
      priceBack: 157.0,
      priceBoth: 170.0,
      badge: null,
      available: true,
      isFeatured: false,
      isNew: false,
      isPremium: false,
      images: ['https://images.unsplash.com/photo-1609864810463-36aef415eded?w=800'],
      colors: ['Preto', 'Cinza Chumbo', 'Cinza Mescla'],
      sizes: ['P', 'M', 'G', 'GG', 'XG'],
      stock: 8,
    },
    {
      categoryId: moletons.id,
      name: 'Moletom Canguru',
      slug: 'moletom-canguru',
      description: 'Moletom Canguru com malha Soft. Com capuz e bolso frontal.',
      fabricType: 'Malha Soft',
      priceFront: 200.0,
      priceBack: 215.0,
      priceBoth: 227.0,
      badge: 'DESTAQUE',
      available: true,
      isFeatured: true,
      isNew: true,
      isPremium: false,
      images: ['https://images.unsplash.com/photo-1644942888603-626d68a31fce?w=800'],
      colors: ['Preto', 'Cinza', 'Vinho'],
      sizes: ['P', 'M', 'G', 'GG', 'XG'],
      stock: 6,
    },
  ]

  for (const produto of produtos) {
    const { images, colors, sizes, stock, ...data } = produto

    // Gera todas as combinações cor × tamanho como variantes
    const variants = colors.flatMap(color =>
      sizes.map(size => ({
        variantId: uuidv4(),
        color,
        size,
        stock: Math.floor(stock / sizes.length) || 1,
        available: true,
      })),
    )

    const created = await prisma.product.create({
      data: {
        ...data,
        images: {
          create: images.map((url, i) => ({
            url,
            isPrimary: i === 0,
            order: i,
          })),
        },
        variants: {
          create: variants,
        },
      },
    })

    console.log(`✅ Produto criado: ${created.name} (${variants.length} variantes)`)
  }

  // ── Admin padrão ────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@fdstore.com.br' },
    update: {},
    create: {
      name: 'Admin FD Store',
      email: 'admin@fdstore.com.br',
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  })
  console.log('✅ Admin criado: admin@fdstore.com.br / admin123')

  // ── Cupom de exemplo ────────────────────────────────────────
  await prisma.coupon.upsert({
    where: { code: 'FDSTORE10' },
    update: {},
    create: {
      code: 'FDSTORE10',
      type: 'percent',
      value: 10,
      maxUses: 100,
      isActive: true,
    },
  })
  console.log('✅ Cupom criado: FDSTORE10 (10% de desconto)')

  console.log('\n🎉 Seed finalizado com sucesso!')
}

main()
  .catch(e => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(() => {
    void prisma.$disconnect()
  })
