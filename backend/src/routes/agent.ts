import { Router } from 'express'
import { requireUser } from '../auth'
import { askAgent } from '../agent'
import { validate } from '../validate'
import { z } from 'zod'

const router = Router()

const questionSchema = z.object({
  question: z.string().min(1, 'ask something').max(500, 'question too long'),
})

router.post('/', requireUser, validate(questionSchema), async (req, res, next) => {
  try {
    res.json({ answer: await askAgent(req.user!.id, req.body.question) })
  } catch (e) {
    next(e)
  }
})

export default router
