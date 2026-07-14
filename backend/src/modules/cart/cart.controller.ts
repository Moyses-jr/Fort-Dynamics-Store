// src/modules/cart/cart.controller.ts
import { Request, Response } from 'express'
import { cartService } from './cart.service'
import type { AddToCartDto, UpdateCartItemDto } from './cart.schema'

export class CartController {
  async getCart(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    const cart = await cartService.getCart(userId)
    res.json(cart)
  }

  async addItem(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    const item = await cartService.addItem(userId, req.body as AddToCartDto)
    res.status(201).json(item)
  }

  async updateItem(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    const item = await cartService.updateItem(
      userId,
      req.params.itemId,
      req.body as UpdateCartItemDto,
    )
    res.json(item)
  }

  async removeItem(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    await cartService.removeItem(userId, req.params.itemId)
    res.status(204).send()
  }

  async clearCart(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    await cartService.clearCart(userId)
    res.status(204).send()
  }
}

export const cartController = new CartController()
