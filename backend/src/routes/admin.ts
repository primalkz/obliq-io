import { Router } from 'express'
import { prisma } from '../prisma'
import { AppError } from '../errors'
import { requireUser, requireRole } from '../auth'

const router = Router()
router.use(requireUser, requireRole('ADMIN'))

router.get('/users', async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { clients: true } },
      },
    })
    res.json(users.map(({ _count, ...u }) => ({ ...u, clients: _count.clients })))
  } catch (e) {
    next(e)
  }
})

router.delete('/users/:id', async (req, res, next) => {
  try {
    if (req.params.id === req.user!.id) throw new AppError(400, 'admins cannot delete themselves')
    const user = await prisma.user.findUnique({ where: { id: req.params.id as string } })
    if (!user) throw new AppError(404, 'user not found')
    await prisma.user.delete({ where: { id: user.id } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
