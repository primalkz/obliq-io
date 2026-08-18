import express from 'express'
import cors from 'cors'
import { errorHandler } from './errors'
import authRoutes from './routes/auth'
import clientRoutes from './routes/clients'
import filingRoutes from './routes/filings'
import adminRoutes from './routes/admin'
import agentRoutes from './routes/agent'

const app = express()

app.use(
  cors({
    origin: (process.env.CLIENT_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
    credentials: true,
  }),
)
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/clients', clientRoutes)
app.use('/api/filings', filingRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/agent', agentRoutes)

app.use(errorHandler)

export default app
