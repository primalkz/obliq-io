'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, PencilSimple } from '@phosphor-icons/react'
import DashSidebar from '../../components/dash-sidebar'
import { Modal, tone } from '../../components/form-bits'
import { api } from '../../lib'
import type { Client, Filing } from '../../dashboard/shared'

type Detail = Client & { filings: Filing[] }

export default function ClientDetail() {
  const router = useRouter()
  const [me, setMe] = useState<{ name: string } | null>(null)
  const [client, setClient] = useState<Detail | null>(null)
  const [edit, setEdit] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    api('/auth/me').then(setMe).catch(() => {})
    const id = location.pathname.split('/').pop()
    api(`/clients/${id}`)
      .then(setClient)
      .catch(() => router.push('/dashboard'))
  }, [router])

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr('')
    const f = new FormData(e.currentTarget)
    try {
      const c = await api(`/clients/${client!.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name: f.get('name'), gstin: f.get('gstin') || undefined }),
      })
      setClient({ ...client!, ...c })
      setEdit(false)
    } catch (e: any) {
      setErr(e.message)
    }
  }

  async function removeFiling(f: Filing) {
    if (!confirm(`delete ${f.title}?`)) return
    try {
      await api(`/filings/${f.id}`, { method: 'DELETE' })
      const c = await api(`/clients/${client!.id}`)
      setClient(c)
    } catch (e: any) {
      setErr(e.message)
    }
  }

  return (
    <main className="min-h-[100dvh] bg-sky">
      <DashSidebar me={me} active="clients" />

      <div className="px-6 pb-20 pt-8 md:pl-[17rem] md:pr-10">
        <div className="mx-auto max-w-2xl space-y-6">
          <Link href="/dashboard?tab=clients" className="inline-flex items-center gap-2 text-sm text-ink-body hover:text-ink">
            <ArrowLeft size={16} /> back to clients
          </Link>

          {client ? (
            <>
              <div className="card-glass p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl font-semibold">{client.name}</h1>
                    <p className="mt-1 font-mono text-xs text-ink-muted">{client.gstin ?? 'unregistered'}</p>
                  </div>
                  <button
                    onClick={() => setEdit(true)}
                    className="btn-ghost items-center !px-4 !py-2 text-sm"
                  >
                    <PencilSimple size={14} /> edit
                  </button>
                </div>
                <div className="mt-6 flex gap-3">
                  <span className="rounded-full bg-white/70 px-3 py-1 font-mono text-[11px] text-ink-body">
                    {client.filings.length} filings
                  </span>
                  <span className="rounded-full bg-accent-orange/10 px-3 py-1 font-mono text-[11px] text-accent-orange">
                    {client.filings.filter((f) => f.status === 'OVERDUE').length} overdue
                  </span>
                </div>
              </div>

              {edit && (
            <Modal title="edit client" onClose={() => setEdit(false)}>
              <form onSubmit={save} className="grid gap-4">
                <label className="block text-sm font-medium">
                  Name
                  <input name="name" defaultValue={client.name} required className="mt-1 w-full rounded-container border border-line bg-white/80 px-4 py-3 text-[15px] outline-none focus:border-ink/40" />
                </label>
                <label className="block text-sm font-medium">
                  GSTIN
                  <input name="gstin" defaultValue={client.gstin ?? ''} className="mt-1 w-full rounded-container border border-line bg-white/80 px-4 py-3 text-[15px] outline-none focus:border-ink/40" />
                </label>
                <button className="btn-primary">save changes</button>
              </form>
            </Modal>
          )}

          {err && <p className="rounded-container bg-accent-orange/10 px-4 py-2.5 text-sm text-accent-orange">{err}</p>}

              <section className="card-glass divide-y divide-line/60 p-2">
                {client.filings.length === 0 && (
                  <p className="p-6 text-center text-sm text-ink-muted">no filings for this client yet.</p>
                )}
                {client.filings.map((f) => (
                  <Link
                    key={f.id}
                    href={`/filings/${f.id}`}
                    className="flex items-center justify-between gap-3 rounded-container p-4 transition-colors hover:bg-white/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {f.title}
                        {f.period ? <span className="text-ink-muted"> · {f.period}</span> : ''}
                      </p>
                      <p className="text-xs text-ink-muted">
                        due {new Date(f.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] ${tone[f.status]}`}>
                      {f.status}
                    </span>
                  </Link>
                ))}
              </section>
            </>
          ) : (
            <div className="card-glass p-8">
              <div className="h-8 w-48 animate-pulse rounded-full bg-white/70" />
              <div className="mt-6 h-24 animate-pulse rounded-container bg-white/50" />
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
