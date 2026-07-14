// src/modules/orders/orders.controller.ts
import { Request, Response } from 'express'
import { ordersService } from './orders.service'
import type { CreateOrderDto, UpdateOrderStatusDto } from './orders.schema'

export class OrdersController {
  async create(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    const order = await ordersService.create(userId, req.body as CreateOrderDto)
    res.status(201).json(order)
  }

  async list(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    const result = await ordersService.listByUser(userId, req)
    res.json(result)
  }

  async findById(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    const order = await ordersService.findById(req.params.id, userId)
    res.json(order)
  }

  async cancel(req: Request, res: Response): Promise<void> {
    const userId = req.user!.userId
    await ordersService.cancel(req.params.id, userId)
    res.status(204).send()
  }

  // Admin
  async listAll(req: Request, res: Response): Promise<void> {
    const result = await ordersService.listAll(req)
    res.json(result)
  }

  async updateStatus(req: Request, res: Response): Promise<void> {
    const order = await ordersService.updateStatus(req.params.id, req.body as UpdateOrderStatusDto)
    res.json(order)
  }
}

export const ordersController = new OrdersController()
