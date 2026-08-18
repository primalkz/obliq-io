import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../prisma'
import { AppError } from '../errors'
import { validate } from '../validate'
import { requireUser } from '../auth'

const router = Router()
router.use(requireUser)

const filingSchema = z.object({
  clientId: z.string().min(1),
  title: z.string().min(1, 'title needed'),
  period: z.string().optional(),
  dueDate: z.coerce.date(),
})

// status derived, never stored
function withStatus(f: { dueDate: Date; filedAt: Date | null }) {
  const status = f.filedAt ? 'FILED' : f.dueDate < new Date() ? 'OVERDUE' : 'UPCOMING'
  return { ...f, status }
}

async function ownedClient(userId: string, clientId: string) {
  const c = await prisma.client.findUnique({ where: { id: clientId } })
  if (!c || c.userId !== userId) throw new AppError(404, 'client not found')
  return c
}

// 404 if not ours
async function ownedFiling(userId: string, id: string) {
  const f = await prisma.filing.findUnique({ where: { id }, include: { client: true } })
  if (!f || f.client.userId !== userId) throw new AppError(404, 'filing not found')
  return f
}

router.get('/', async (req, res, next) => {
  try {
    const filings = await prisma.filing.findMany({
      where: { client: { userId: req.user!.id } },
      orderBy: { dueDate: 'asc' },
      include: { client: { select: { name: true } } },
    })
    res.json(filings.map((f) => withStatus(f)))
  } catch (e) {
    next(e)
  }
})

router.post('/', validate(filingSchema), async (req, res, next) => {
  try {
    await ownedClient(req.user!.id, req.body.clientId)
    const { clientId, title, period, dueDate } = req.body
    const filing = await prisma.filing.create({ data: { clientId, title, period, dueDate } })
    res.status(201).json(withStatus(filing))
  } catch (e) {
    next(e)
  }
})

router.patch('/:id/filed', async (req, res, next) => {
  try {
    const filing = await ownedFiling(req.user!.id, req.params.id as string)
    const updated = await prisma.filing.update({
      where: { id: filing.id },
      data: { filedAt: new Date() },
    })
    res.json(withStatus(updated))
  } catch (e) {
    next(e)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const filing = await ownedFiling(req.user!.id, req.params.id as string)
    await prisma.filing.delete({ where: { id: filing.id } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

export default router
