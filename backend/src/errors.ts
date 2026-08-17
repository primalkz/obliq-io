import type { NextFunction, Request, Response } from 'express'

export class AppError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) return res.status(err.status).json({ error: err.message })
  console.error(err)
  res.status(500).json({ error: 'something went wrong' })
}
