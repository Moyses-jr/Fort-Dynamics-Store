/// <reference types="node" />
import { PrismaClient, UserRole } from '@prisma/client'
import { env } from '../src/config/env'
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
  const adminPassword = await bcrypt.hash(env.ADMIN_SEED_PASSWORD, 12)
  await prisma.user.upsert({
    where: { email: env.ADMIN_SEED_EMAIL },
    update: {},
    create: {
      name: env.ADMIN_SEED_NAME,
      email: env.ADMIN_SEED_EMAIL,
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
  })
  console.log('✅ Admin criado: ' + env.ADMIN_SEED_EMAIL)

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

  // ── Clientes + pedidos de exemplo (para o Dashboard admin) ──
  const clientesSeed = [
    { name: 'Rafael Silva', email: 'rafael.silva@fdstore.com' },
    { name: 'Mariana Costa', email: 'mariana.costa@fdstore.com' },
    { name: 'Lucas Ferreira', email: 'lucas.ferreira@fdstore.com' },
  ]

  const senhaCliente = await bcrypt.hash('cliente123', 12)
  const produtosCriados = await prisma.product.findMany({
    include: { variants: true },
    take: 6,
  })

  for (const c of clientesSeed) {
    const cliente = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        name: c.name,
        email: c.email,
        passwordHash: senhaCliente,
        role: UserRole.CUSTOMER,
        isActive: true,
      },
    })

    const endereco = await prisma.address.upsert({
      where: { id: `seed-addr-${cliente.id}` },
      update: {},
      create: {
        id: `seed-addr-${cliente.id}`,
        userId: cliente.id,
        street: 'Rua Exemplo',
        number: '100',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01000000',
        isDefault: true,
      },
    })

    const produto = produtosCriados[Math.floor(Math.random() * produtosCriados.length)]
    const variante = produto?.variants[0]
    if (!produto || !variante) continue

    const existente = await prisma.order.findFirst({ where: { userId: cliente.id } })
    if (existente) continue

    const subtotal = Number(produto.priceBoth)
    await prisma.order.create({
      data: {
        userId: cliente.id,
        addressId: endereco.id,
        subtotal,
        shippingCost: 0,
        total: subtotal,
        status: ['pending', 'confirmed', 'production'][Math.floor(Math.random() * 3)],
        paymentMethod: 'pix',
        paymentStatus: 'paid',
        items: {
          create: {
            productId: produto.id,
            variantId: variante.id,
            quantity: 1,
            unitPrice: subtotal,
            subtotal,
            productName: produto.name,
            color: variante.color,
            size: variante.size,
          },
        },
        statusHistory: { create: { status: 'pending', note: 'Pedido de exemplo (seed)' } },
      },
    })
  }
  console.log('✅ Clientes e pedidos de exemplo criados')

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
