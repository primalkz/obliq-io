import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../prisma'
import { AppError } from '../errors'
import { validate } from '../validate'
import { setAuthCookie, clearAuthCookie, requireUser } from '../auth'

const router = Router()

const credentials = z.object({
  email: z.string().email('valid email needed'),
  password: z.string().min(8, 'password needs 8+ chars'),
})

const registerSchema = credentials.extend({ name: z.string().min(1, 'name needed') })

const shape = (u: { id: string; email: string; name: string; role: string }) => ({
  userId: u.id,
  email: u.email,
  name: u.name,
  role: u.role,
})

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.body
    try {
      const user = await prisma.user.create({
        data: { email, name, passwordHash: await bcrypt.hash(password, 10) },
      })
      setAuthCookie(res, user.id)
      res.status(201).json(shape(user))
    } catch (e: any) {
      // unique violation means email taken
      if (e?.code === 'P2002') throw new AppError(409, 'email already registered')
      throw e
    }
  } catch (e) {
    next(e)
  }
})

router.post('/login', validate(credentials), async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    // same msg both ways so we dont leak which emails exist
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError(401, 'wrong email or password')
    }
    setAuthCookie(res, user.id)
    res.json(shape(user))
  } catch (e) {
    next(e)
  }
})

router.post('/logout', (_req, res) => {
  clearAuthCookie(res)
  res.json({ ok: true })
})

router.get('/me', requireUser, (req, res) => {
  res.json(shape(req.user!))
})

router.patch('/me', requireUser, validate(z.object({ name: z.string().min(1, 'name needed').optional(), email: z.string().email('valid email needed').optional() })), async (req, res, next) => {
  try {
    if (req.body.email) {
      const taken = await prisma.user.findUnique({ where: { email: req.body.email } })
      if (taken && taken.id !== req.user!.id) throw new AppError(409, 'email already registered')
    }
    const user = await prisma.user.update({ where: { id: req.user!.id }, data: req.body })
    res.json(shape(user))
  } catch (e) {
    next(e)
  }
})

router.put('/me/password', requireUser, validate(credentials.pick({ password: true }).extend({ current: z.string().min(1, 'current password needed') })), async (req, res, next) => {
  try {
    const ok = await bcrypt.compare(req.body.current, req.user!.passwordHash)
    if (!ok) throw new AppError(401, 'wrong current password')
    const passwordHash = await bcrypt.hash(req.body.password, 10)
    await prisma.user.update({ where: { id: req.user!.id }, data: { passwordHash } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

router.delete('/me', requireUser, async (req, res, next) => {
  try {
    // cascade wipes clients and filings too
    await prisma.user.delete({ where: { id: req.user!.id } })
    clearAuthCookie(res)
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
