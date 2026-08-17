import 'dotenv/config'
import app from './app'

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET missing')
  process.exit(1)
}

const port = Number(process.env.PORT ?? 4000)
app.listen(port, () => console.log(`api on :${port}`))
