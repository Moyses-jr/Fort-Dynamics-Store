# FD Store — Backend API

API REST completa para o e-commerce FD Store.

## Stack

- **Runtime**: Node.js 20 LTS
- **Linguagem**: TypeScript 5
- **Framework**: Express 4
- **ORM**: Prisma 6 + PostgreSQL 16
- **Cache**: Redis 7
- **Autenticação**: JWT (access 15min + refresh 7d em cookie httpOnly)
- **Pagamentos**: Mercado Pago (PIX, cartão, boleto)
- **Email**: Resend
- **Uploads**: Cloudflare R2
- **Validação**: Zod

## Pré-requisitos

- Node.js 20+
- PostgreSQL 16
- Redis 7 (ou Docker)

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Copiar e preencher variáveis de ambiente
cp .env.example .env

# 3. Subir Redis com Docker (opcional)
docker-compose up -d

# 4. Rodar migrations
npm run db:migrate

# 5. Popular banco com dados iniciais
npm run db:seed

# 6. Iniciar em modo desenvolvimento
npm run dev
```

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia com hot-reload (tsx watch) |
| `npm run build` | Compila TypeScript |
| `npm start` | Inicia versão compilada |
| `npm run db:migrate` | Roda migrations (dev) |
| `npm run db:migrate:prod` | Deploy de migrations (prod) |
| `npm run db:seed` | Popula banco com dados iniciais |
| `npm run db:studio` | Abre Prisma Studio |
| `npm test` | Roda testes |
| `npm run lint` | Verifica lint |

## Usuário admin padrão (seed)

```
Email: admin@fdstore.com.br
Senha: admin123
```

## Endpoints principais

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

GET    /api/v1/products
GET    /api/v1/products/featured
GET    /api/v1/products/:id
GET    /api/v1/categories

GET    /api/v1/cart
POST   /api/v1/cart
PATCH  /api/v1/cart/:itemId
DELETE /api/v1/cart/:itemId

POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/:id

POST   /api/v1/payments/pix/:orderId
POST   /api/v1/payments/card/:orderId
POST   /api/v1/payments/boleto/:orderId
POST   /api/v1/payments/webhook

GET    /api/v1/users/me
GET    /api/v1/users/me/addresses
GET    /api/v1/users/me/favorites

POST   /api/v1/coupons/validate
POST   /api/v1/uploads/art

GET    /api/v1/health
GET    /api/v1/cep/:cep
GET    /api/v1/stats  (admin)
```

## Estrutura

```
src/
├── config/          # env, database, redis, logger
├── middlewares/     # auth, admin, validate, error
├── modules/
│   ├── auth/        # register, login, refresh, logout, reset
│   ├── users/       # perfil, endereços, favoritos
│   ├── products/    # catálogo com variantes (cor × tamanho)
│   ├── categories/  # listagem de categorias
│   ├── cart/        # carrinho com validação de estoque
│   ├── orders/      # checkout completo em transação
│   ├── payments/    # PIX, cartão, boleto + webhook MP
│   ├── coupons/     # validação e gestão de cupons
│   ├── uploads/     # artes no Cloudflare R2
│   └── admin/       # stats, health, CEP
└── shared/
    ├── errors/      # AppError e subclasses
    ├── types/       # express.d.ts
    └── utils/       # jwt, bcrypt, email, cep, pagination
```
