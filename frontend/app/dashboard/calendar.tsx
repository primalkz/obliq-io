'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { inputCls, ErrorBox, Modal, useToast, tone } from '../components/form-bits'
import { api } from '../lib'
import InsightCard from './insight-card'
import type { Filing, Client } from './shared'
import { day } from './shared'

export default function CalendarView({
  me,
  filings,
  clients,
  reload,
  gridOnly = false,
}: {
  me: { name: string } | null
  filings: Filing[]
  clients: Client[]
  reload: () => Promise<void>
  gridOnly?: boolean
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [view, setView] = useState<'list' | 'grid'>(gridOnly ? 'grid' : 'list')
  const [monthOffset, setMonthOffset] = useState(0)
  const [err, setErr] = useState('')
  const { show, node: toast } = useToast()

  async function addFiling(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr('')
    const f = new FormData(e.currentTarget)
    try {
      await api('/filings', {
        method: 'POST',
        body: JSON.stringify({
          clientId: f.get('clientId'),
          title: f.get('title'),
          period: f.get('period') || undefined,
          dueDate: f.get('dueDate'),
        }),
      })
      setShowForm(false)
      show('filing added')
      await reload()
    } catch (e: any) {
      setErr(e.message)
    }
  }

  const counts = ['OVERDUE', 'UPCOMING', 'FILED'].map((s) => ({
    s,
    n: filings.filter((f) => f.status === s).length,
  }))

  const base = new Date()
  base.setDate(1)
  base.setMonth(base.getMonth() + monthOffset)
  const year = base.getFullYear()
  const month = base.getMonth()
  const monthName = base.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const startPad = (new Date(year, month, 1).getDay() + 6) % 7
  const daysIn = new Date(year, month + 1, 0).getDate()
  const byDay: Record<string, Filing[]> = {}
  for (const f of filings) {
    const k = f.dueDate.slice(0, 10)
    if (!byDay[k]) byDay[k] = []
    byDay[k].push(f)
  }
  const cells = [
    ...Array.from({ length: startPad }, () => null),
    ...Array.from({ length: daysIn }, (_, i) => i + 1),
  ]

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">{gridOnly ? 'calendar' : 'compliance calendar'}</p>
          <h1 className="font-display text-3xl font-semibold">
            {gridOnly ? 'Filings by date' : `Hello, ${me?.name?.split(' ')[0]}`}
          </h1>
          {!gridOnly && (
            <p className="mt-1 text-sm text-ink-body">
              {counts.find((c) => c.s === 'OVERDUE')?.n} overdue ·{' '}
              {counts.find((c) => c.s === 'UPCOMING')?.n} upcoming
            </p>
          )}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary px-5 py-2 text-sm">
          {showForm ? 'close' : '+ add filing'}
        </button>
      </div>

      {!gridOnly && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {counts.map(({ s, n }) => (
            <div key={s} className="card-glass p-5 text-center md:p-6">
              <p className="font-display text-3xl font-semibold md:text-4xl">{n}</p>
              <span className={`mt-3 inline-block rounded-full px-2.5 py-0.5 font-mono text-[10px] ${tone[s]}`}>
                {s}
              </span>
            </div>
          ))}
        </div>
      )}

      {!gridOnly && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex rounded-full border border-line bg-white/60 p-1">
            {(['list', 'grid'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-4 py-1.5 font-display text-xs font-medium transition-colors ${
                  view === v ? 'bg-ink text-white' : 'text-ink-body'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          {view === 'grid' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMonthOffset(monthOffset - 1)}
                className="rounded-full border border-line bg-white/60 px-3 py-1 text-sm hover:bg-white"
              >
                ←
              </button>
              <span className="font-display text-sm font-semibold">{monthName}</span>
              <button
                onClick={() => setMonthOffset(monthOffset + 1)}
                className="rounded-full border border-line bg-white/60 px-3 py-1 text-sm hover:bg-white"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}

      {view === 'grid' && (
        <div className="card-glass p-4">
          <div className="grid grid-cols-7 gap-1.5">            {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((d) => (
              <p key={d} className="pb-1 text-center font-mono text-[10px] uppercase text-ink-muted">
                {d}
              </p>
            ))}
            {cells.map((d, i) => (
              <div
                key={i}
                className={`min-h-20 rounded-container p-1.5 ${d ? 'bg-white/60' : 'opacity-0'}`}
              >
                {d && (
                  <>
                    <p className="font-mono text-[10px] text-ink-muted">{d}</p>
                    <div className="mt-1 space-y-1">
                      {(byDay[`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`] ?? [])
                        .slice(0, 2)
                        .map((f) => (
                          <button
                            key={f.id}
                            onClick={() => router.push(`/filings/${f.id}`)}
                            className={`block w-full truncate rounded px-1.5 py-0.5 text-left font-mono text-[9px] ${tone[f.status]}`}
                          >
                            {f.title}
                          </button>
                        ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!gridOnly && (
        <>
          {toast}
          <InsightCard />
        </>
      )}

      {showForm && (
        <Modal title="add filing" onClose={() => setShowForm(false)}>
          <ErrorBox msg={err} />
          <form onSubmit={addFiling} className="grid gap-4">
            <label className="block text-sm font-medium">
              Client
              <select name="clientId" required className={`${inputCls} mt-1`}>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Filing
                <input name="title" required placeholder="GSTR-3B" className={`${inputCls} mt-1`} />
              </label>
              <label className="block text-sm font-medium">
                Period
                <input name="period" placeholder="Aug 2026" className={`${inputCls} mt-1`} />
              </label>
            </div>
            <label className="block text-sm font-medium">
              Due date
              <input name="dueDate" type="date" required className={`${inputCls} mt-1`} />
            </label>
            <button className="btn-primary">add filing</button>
          </form>
        </Modal>
      )}

      <section className="card-glass overflow-hidden">
        <table className="hidden w-full text-left text-sm md:table">
          <thead>
            <tr className="border-b border-line/70 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              <th className="px-6 py-4 font-normal">filing</th>
              <th className="px-6 py-4 font-normal">client</th>
              <th className="px-6 py-4 font-normal">due</th>
              <th className="px-6 py-4 text-right font-normal">status</th>
            </tr>
          </thead>
          <tbody>
            {filings.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-ink-muted">
                  nothing here yet. add your first deadline above.
                </td>
              </tr>
            )}
            {filings.map((f) => (
              <tr
                key={f.id}
                onClick={() => router.push(`/filings/${f.id}`)}
                className="cursor-pointer border-b border-line/40 transition-colors duration-150 last:border-0 hover:bg-white/50"
              >
                <td className="px-6 py-4 font-medium">
                  {f.title}
                  {f.period ? <span className="text-ink-muted"> · {f.period}</span> : ''}
                </td>
                <td className="px-6 py-4 text-ink-body">{f.client.name}</td>
                <td className="px-6 py-4 text-ink-body">{day(f.dueDate)}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`mr-3 rounded-full px-2.5 py-1 font-mono text-[10px] ${tone[f.status]}`}>
                    {f.status}
                  </span>
                  <span className="font-mono text-xs text-accent-blue">view →</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="divide-y divide-line/60 p-2 md:hidden">
          {filings.length === 0 && (
            <p className="p-6 text-center text-sm text-ink-muted">
              no filings yet. add your first deadline above.
            </p>
          )}
          {filings.map((f) => (
            <button
              key={f.id}
              onClick={() => router.push(`/filings/${f.id}`)}
              className="flex w-full flex-wrap items-center justify-between gap-3 rounded-container p-4 text-left transition-colors hover:bg-white/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {f.title}
                  {f.period ? ` · ${f.period}` : ''}
                </p>
                <p className="text-xs text-ink-muted">
                  {f.client.name} · due {day(f.dueDate)}
                </p>
              </div>
              <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] ${tone[f.status]}`}>{f.status}</span>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}
