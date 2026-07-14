// src/modules/users/users.service.ts
import { prisma } from '../../config/database'
import { NotFoundError, ConflictError } from '../../shared/errors/AppError'
import type { UpdateUserDto, CreateAddressDto, UpdateAddressDto } from './users.schema'

export class UsersService {
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        cpf: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            favorites: true,
            addresses: true,
          },
        },
      },
    })

    if (!user) throw new NotFoundError('Usuario')
    return user
  }

  async update(userId: string, data: UpdateUserDto) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, phone: true, updatedAt: true },
    })
  }

  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
    })
  }

  async createAddress(userId: string, data: CreateAddressDto) {
    const count = await prisma.address.count({ where: { userId } })
    const isDefault = data.isDefault ?? count === 0

    if (isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } })
    }

    return prisma.address.create({
      data: { ...data, userId, isDefault },
    })
  }

  async updateAddress(userId: string, addressId: string, data: UpdateAddressDto) {
    const address = await prisma.address.findFirst({ where: { id: addressId, userId } })
    if (!address) throw new NotFoundError('Endereco')

    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } })
    }

    return prisma.address.update({ where: { id: addressId }, data })
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({ where: { id: addressId, userId } })
    if (!address) throw new NotFoundError('Endereco')

    await prisma.address.delete({ where: { id: addressId } })

    if (address.isDefault) {
      const next = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      })
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } })
    }
  }

  async getFavorites(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            priceBoth: true,
            badge: true,
            available: true,
            images: { where: { isPrimary: true }, select: { url: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async addFavorite(userId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new NotFoundError('Produto')

    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    })
    if (existing) throw new ConflictError('Produto ja esta nos favoritos')

    return prisma.favorite.create({
      data: { userId, productId },
    })
  }

  async removeFavorite(userId: string, productId: string) {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_productId: { userId, productId } },
    })
    if (!favorite) throw new NotFoundError('Favorito')

    await prisma.favorite.delete({
      where: { userId_productId: { userId, productId } },
    })
  }

  async listAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isActive: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    })
  }

  async setActive(userId: string, isActive: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: { id: true, name: true, email: true, isActive: true },
    })
  }
}

export const usersService = new UsersService()
