import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

const days = (n: number) => new Date(Date.now() + n * 86400000)

async function main() {
  await db.user.upsert({
    where: { email: 'admin@obliq.io' },
    update: {},
    create: {
      email: 'admin@obliq.io',
      name: 'Obliq Admin',
      role: 'ADMIN',
      passwordHash: await bcrypt.hash('obliqadmin1', 10),
    },
  })

  const existing = await db.user.findUnique({ where: { email: 'aarti@kumarassociates.in' } })
  if (existing) return

  const user = await db.user.create({
    data: {
      email: 'aarti@kumarassociates.in',
      name: 'Aarti Kumar',
      passwordHash: await bcrypt.hash('obliqdemo1', 10),
    },
  })

  const clients = await Promise.all(
    [
      { name: 'Shree Ganesh Textiles Pvt Ltd', gstin: '27ABCDE1234F1Z5' },
      { name: 'Kulkarni Foods & Spices', gstin: '27FGHIJ5678K2Z9' },
      { name: 'Verma Solar Energy LLP', gstin: '07JKLMN9012P3Z4' },
      { name: 'Mehta Jewellers', gstin: '08OPQRS3456T7Z1' },
      { name: 'Nandi Logistics Pvt Ltd', gstin: '29UVWXY7890A2Z6' },
      { name: 'Dr. Iyer Clinic', gstin: null },
    ].map((c) => db.client.create({ data: { ...c, userId: user.id } })),
  )

  const [textiles, foods, solar, jewellers, logistics] = clients

  // [clientId, title, period, dueDate offset in days, filedAt offset or null]
  const rows: [number, string, string | null, number, number | null][] = [
    [textiles.id, 'GSTR-3B', 'Jul 2026', -40, -38],
    [foods.id, 'GSTR-1', 'Jul 2026', -41, -42],
    [solar.id, 'GSTR-3B', 'Jul 2026', -40, -35],
    [jewellers.id, 'GSTR-3B', 'Aug 2026', -12, -14],
    [logistics.id, 'GSTR-1', 'Aug 2026', -11, -11],
    [textiles.id, 'TDS 26Q', 'Q1 FY26-27', -20, -19],
    [logistics.id, 'PF ECR', 'Jul 2026', -30, -28],
    [solar.id, 'ESI contribution', 'Jul 2026', -25, null],
    [jewellers.id, 'Advance tax', 'Q2 FY26-27', -4, null],
    [textiles.id, 'GSTR-3B', 'Aug 2026', -2, null],
    [foods.id, 'ITR-3', 'FY 2025-26', 3, null],
    [solar.id, 'TDS 24Q', 'Q1 FY26-27', 9, null],
    [jewellers.id, 'GST annual return', 'FY 2025-26', 21, null],
    [logistics.id, 'GSTR-9', 'FY 2025-26', 34, null],
    [textiles.id, 'Tax audit 44AB', 'FY 2025-26', 45, null],
  ]

  for (const [clientId, title, period, due, filedAt] of rows) {
    await db.filing.create({
      data: {
        clientId,
        title,
        period,
        dueDate: days(due),
        ...(filedAt !== null ? { filedAt: days(filedAt) } : {}),
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
