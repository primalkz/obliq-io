import type { NextFunction, Request, Response } from 'express'
import type { z } from 'zod'
import { AppError } from './errors'

export function validate<T>(schema: z.ZodType<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const r = schema.safeParse(req.body)
    if (!r.success) {
      const msg = r.error.issues.map((i) => i.message).join(', ')
      return next(new AppError(400, msg))
    }
    req.body = r.data
    next()
  }
}
