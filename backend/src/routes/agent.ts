import { Router } from 'express'
import { requireUser } from '../auth'
import { askAgent } from '../agent'
import { validate } from '../validate'
import { z } from 'zod'

const router = Router()

const questionSchema = z.object({
  question: z.string().min(1, 'ask something').max(500, 'question too long'),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      }),
    )
    .max(10)
    .optional(),
})

router.post('/', requireUser, validate(questionSchema), async (req, res, next) => {
  try {
    const answer = await askAgent(req.user!.id, req.body.question, req.body.history ?? [])
    res.json({ answer })
  } catch (e) {
    next(e)
  }
})

export default router
