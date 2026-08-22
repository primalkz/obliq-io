import { prisma } from './prisma'

export const tools = [
  {
    type: 'function',
    function: {
      name: 'get_filings',
      description: 'list the user statutory filings, optionally filtered by status',
      parameters: {
        type: 'object',
        properties: { status: { type: 'string', enum: ['OVERDUE', 'UPCOMING', 'FILED'] } },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_clients',
      description: 'list the user clients with total and overdue filing counts',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_stats',
      description: 'filing counts by status for the whole firm',
      parameters: { type: 'object', properties: {} },
    },
  },
]

const statusOf = (f: { dueDate: Date; filedAt: Date | null }) =>
  f.filedAt ? 'FILED' : f.dueDate < new Date() ? 'OVERDUE' : 'UPCOMING'

export async function runTool(userId: string, name: string, args: any): Promise<string> {
  if (name === 'get_filings') {
    const all = await prisma.filing.findMany({
      where: { client: { userId } },
      orderBy: { dueDate: 'asc' },
      include: { client: { select: { name: true } } },
    })
    const rows = all.map((f) => ({
      id: f.id,
      client: f.client.name,
      filing: f.title,
      period: f.period,
      due: f.dueDate.toISOString().slice(0, 10),
      status: statusOf(f),
      url: `/filings/${f.id}`,
    }))
    return JSON.stringify(rows.filter((f) => !args.status || f.status === args.status))
  }
  if (name === 'get_clients') {
    const clients = await prisma.client.findMany({
      where: { userId },
      include: {
        filings: { where: { filedAt: null, dueDate: { lt: new Date() } }, select: { id: true } },
        _count: { select: { filings: true } },
      },
    })
    return JSON.stringify(
      clients.map(({ _count, filings, ...c }) => ({
        name: c.name,
        gstin: c.gstin,
        totalFilings: _count.filings,
        overdue: filings.length,
      })),
    )
  }
  const all = await prisma.filing.findMany({
    where: { client: { userId } },
    select: { dueDate: true, filedAt: true },
  })
  const counts = { OVERDUE: 0, UPCOMING: 0, FILED: 0 }
  for (const f of all) counts[statusOf(f)]++
  return JSON.stringify(counts)
}
