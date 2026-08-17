import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import { prisma } from './prisma'
import { AppError } from './errors'

const COOKIE = 'token'

export function setAuthCookie(res: Response, userId: string) {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, {
    expiresIn: '7d',
    algorithm: 'HS256',
  })
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE)
}

// skip cookie-parser and parse the one header we need
function readToken(req: Request): string | null {
  const raw = req.headers.cookie
  if (!raw) return null
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === COOKIE) return decodeURIComponent(v.join('='))
  }
  return null
}

export async function requireUser(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = readToken(req)
    if (!token) throw new AppError(401, 'not signed in')
    let payload: { sub?: string }
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!, { algorithms: ['HS256'] }) as { sub?: string }
    } catch {
      throw new AppError(401, 'session expired')
    }
    const user = await prisma.user.findUnique({ where: { id: payload.sub! } })
    if (!user) throw new AppError(401, 'not signed in')
    req.user = user
    next()
  } catch (e) {
    next(e)
  }
}

export function requireRole(role: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) return next(new AppError(403, 'not allowed'))
    next()
  }
}
