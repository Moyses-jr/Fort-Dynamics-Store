// src/shared/utils/pagination.ts
import { Request } from 'express'

export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function getPagination(req: Request, defaultLimit = 12): PaginationParams {
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10))
  const limit = Math.min(
    100,
    Math.max(1, parseInt(String(req.query.limit ?? String(defaultLimit)), 10)),
  )
  const skip = (page - 1) * limit
  return { page, limit, skip }
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  { page, limit }: PaginationParams,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit)
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  }
}
