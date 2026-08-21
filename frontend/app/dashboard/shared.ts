export type Filing = {
  id: string
  title: string
  period?: string | null
  dueDate: string
  filedAt: string | null
  status: 'UPCOMING' | 'OVERDUE' | 'FILED'
  client: { name: string }
}

export type Client = {
  id: string
  name: string
  gstin?: string | null
  total?: number
  overdue?: number
}

export const day = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
