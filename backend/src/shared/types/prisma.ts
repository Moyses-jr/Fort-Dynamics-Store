// src/shared/types/prisma.ts
// Tipos independentes do Prisma Client gerado — evita dependência de `prisma generate`

export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// Equivalente ao Prisma.InputJsonValue
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }
