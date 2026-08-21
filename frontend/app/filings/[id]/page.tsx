'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Trash } from '@phosphor-icons/react'
import DashSidebar from '../../components/dash-sidebar'
import { tone } from '../../components/form-bits'
import { api } from '../../lib'
import type { Filing } from '../../dashboard/shared'

const rows = [
  ['client', (f: Filing) => f.client.name],
  ['period', (f: Filing) => f.period ?? '-'],
  ['due', (f: Filing) => new Date(f.dueDate).toDateString()],
  ['filed', (f: Filing) => (f.filedAt ? new Date(f.filedAt).toDateString() : 'not yet')],
] as const

export default function FilingDetail() {
  const router = useRouter()
  const [filing, setFiling] = useState<Filing | null>(null)
  const [me, setMe] = useState<{ name: string } | null>(null)
  const [err, setErr] = useState('')
  const [gone, setGone] = useState(false)

  useEffect(() => {
    api('/auth/me').then(setMe).catch(() => {})
    const id = location.pathname.split('/').pop()
    api(`/filings/${id}`)
      .then(setFiling)
      .catch(() => router.push('/dashboard'))
  }, [router])

  async function markFiled() {
    setErr('')
    try {
      const f = await api(`/filings/${filing!.id}/filed`, { method: 'PATCH' })
      setFiling(f)
    } catch (e: any) {
      setErr(e.message)
    }
  }

  async function remove() {
    if (!confirm(`delete ${filing!.title} for ${filing!.client.name}?`)) return
    try {
      await api(`/filings/${filing!.id}`, { method: 'DELETE' })
      setGone(true)
      setTimeout(() => router.push('/dashboard'), 600)
    } catch (e: any) {
      setErr(e.message)
    }
  }

  if (gone)
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-sky">
        <p className="font-display text-xl font-semibold">filing deleted</p>
      </main>
    )

  return (
    <main className="min-h-[100dvh] bg-sky">
      <DashSidebar me={me} active="calendar" />

      <div className="px-6 pb-20 pt-8 md:pl-[17rem] md:pr-10">
        <div className="mx-auto max-w-2xl space-y-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-ink-body hover:text-ink">
            <ArrowLeft size={16} /> back to calendar
          </Link>

          {filing ? (
            <div className="card-glass p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-semibold">{filing.title}</h1>
                  {filing.period && <p className="mt-1 text-sm text-ink-muted">{filing.period}</p>}
                </div>
                <span className={`rounded-full px-3 py-1 font-mono text-[11px] ${tone[filing.status]}`}>
                  {filing.status}
                </span>
              </div>

              <dl className="mt-8 space-y-3 text-sm">
                {rows.map(([k, get]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-6 rounded-container bg-white/70 px-4 py-3.5"
                  >
                    <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">{k}</dt>
                    <dd className="text-right font-medium">{get(filing)}</dd>
                  </div>
                ))}
              </dl>

              <ErrorBox msg={err} />

              <div className="mt-8 flex gap-3">
                {filing.status !== 'FILED' && (
                  <button onClick={markFiled} className="btn-primary flex-1">
                    mark filed
                  </button>
                )}
                <button
                  onClick={remove}
                  className="btn-ghost flex-1 !text-accent-orange hover:!bg-accent-orange/10"
                >
                  <Trash size={15} /> delete
                </button>
              </div>
            </div>
          ) : (
            <div className="card-glass p-8">
              <div className="h-6 w-40 animate-pulse rounded-full bg-white/70" />
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded-container bg-white/50" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  if (!msg) return null
  return <p className="mt-6 rounded-container bg-accent-orange/10 px-4 py-2.5 text-sm text-accent-orange">{msg}</p>
}
