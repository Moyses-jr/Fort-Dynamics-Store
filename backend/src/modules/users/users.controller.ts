// src/modules/users/users.controller.ts
import { Request, Response } from 'express'
import { usersService } from './users.service'
import type { UpdateUserDto, CreateAddressDto, UpdateAddressDto } from './users.schema'

export class UsersController {
  async getMe(req: Request, res: Response): Promise<void> {
    const user = await usersService.getMe(req.user!.userId)
    res.json(user)
  }

  async update(req: Request, res: Response): Promise<void> {
    const user = await usersService.update(req.user!.userId, req.body as UpdateUserDto)
    res.json(user)
  }

  // Endereços
  async getAddresses(req: Request, res: Response): Promise<void> {
    const addresses = await usersService.getAddresses(req.user!.userId)
    res.json(addresses)
  }

  async createAddress(req: Request, res: Response): Promise<void> {
    const address = await usersService.createAddress(req.user!.userId, req.body as CreateAddressDto)
    res.status(201).json(address)
  }

  async updateAddress(req: Request, res: Response): Promise<void> {
    const address = await usersService.updateAddress(
      req.user!.userId,
      req.params.id,
      req.body as UpdateAddressDto,
    )
    res.json(address)
  }

  async deleteAddress(req: Request, res: Response): Promise<void> {
    await usersService.deleteAddress(req.user!.userId, req.params.id)
    res.status(204).send()
  }

  // Favoritos
  async getFavorites(req: Request, res: Response): Promise<void> {
    const favorites = await usersService.getFavorites(req.user!.userId)
    res.json(favorites)
  }

  async addFavorite(req: Request, res: Response): Promise<void> {
    const favorite = await usersService.addFavorite(req.user!.userId, req.params.productId)
    res.status(201).json(favorite)
  }

  async removeFavorite(req: Request, res: Response): Promise<void> {
    await usersService.removeFavorite(req.user!.userId, req.params.productId)
    res.status(204).send()
  }

  // Admin
  async listAll(_req: Request, res: Response): Promise<void> {
    const users = await usersService.listAll()
    res.json(users)
  }

  async setActive(req: Request, res: Response): Promise<void> {
    const { isActive } = req.body as { isActive: boolean }
    const user = await usersService.setActive(req.params.id, isActive)
    res.json(user)
  }
}

export const usersController = new UsersController()
