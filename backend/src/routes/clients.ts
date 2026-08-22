import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { AppError } from '../errors'
import { validate } from '../validate'
import { requireUser } from '../auth'

const router = Router()
router.use(requireUser)

const clientSchema = z.object({
  name: z.string().min(1, 'name needed'),
  gstin: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/, 'gstin looks wrong')
    .optional()
    .or(z.literal('')),
})

router.get('/', async (req, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        filings: { where: { filedAt: null, dueDate: { lt: new Date() } }, select: { id: true } },
        _count: { select: { filings: true } },
      },
    })
    res.json(
      clients.map(({ _count, filings, ...c }) => ({ ...c, total: _count.filings, overdue: filings.length })),
    )
  } catch (e) {
    next(e)
  }
})

router.post('/', validate(clientSchema), async (req, res, next) => {
  try {
    const client = await prisma.client.create({
      data: { userId: req.user!.id, name: req.body.name, gstin: req.body.gstin || null },
    })
    res.status(201).json(client)
  } catch (e) {
    next(e)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: {
        filings: { orderBy: { dueDate: 'asc' } },
      },
    })
    if (!client || client.userId !== req.user!.id) throw new AppError(404, 'client not found')
    const { filings, ...c } = client
    res.json({ ...c, filings: filings.map((f) => ({ ...f, status: f.filedAt ? 'FILED' : f.dueDate < new Date() ? 'OVERDUE' : 'UPCOMING' })) })
  } catch (e) {
    next(e)
  }
})

router.patch(
  '/:id',
  validate(clientSchema.partial()),
  async (req, res, next) => {
    try {
      const client = await prisma.client.findUnique({ where: { id: req.params.id as string } })
      if (!client || client.userId !== req.user!.id) throw new AppError(404, 'client not found')
      const data = {
        ...(req.body.name ? { name: req.body.name } : {}),
        ...(req.body.gstin !== undefined ? { gstin: req.body.gstin || null } : {}),
      }
      const updated = await prisma.client.update({ where: { id: client.id }, data })
      res.json(updated)
    } catch (e) {
      next(e)
    }
  },
)

router.delete('/:id', async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({ where: { id: req.params.id as string } })
    if (!client || client.userId !== req.user!.id) throw new AppError(404, 'client not found')
    await prisma.client.delete({ where: { id: client.id } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
