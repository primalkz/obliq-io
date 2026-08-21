'use client'

import { useState } from 'react'
import { Trash } from '@phosphor-icons/react'
import Link from 'next/link'
import { inputCls, ErrorBox, Modal, useToast } from '../components/form-bits'
import { api } from '../lib'
import type { Client } from './shared'

export default function ClientsView({ clients, reload }: { clients: Client[]; reload: () => Promise<void> }) {
  const [form, setForm] = useState<{ mode: 'add' | 'edit'; client?: Client } | null>(null)
  const [err, setErr] = useState('')
  const { show, node: toast } = useToast()

  async function submitClient(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErr('')
    const f = new FormData(e.currentTarget)
    const body = JSON.stringify({ name: f.get('name'), gstin: f.get('gstin') || undefined })
    try {
      await api(form?.mode === 'edit' ? `/clients/${form.client!.id}` : '/clients', {
        method: form?.mode === 'edit' ? 'PATCH' : 'POST',
        body,
      })
      setForm(null)
      show(form?.mode === 'edit' ? 'client updated' : 'client added')
      await reload()
    } catch (e: any) {
      setErr(e.message)
    }
  }

  async function remove(c: Client) {
    if (!confirm(`delete ${c.name} and all their filings?`)) return
    setErr('')
    try {
      await api(`/clients/${c.id}`, { method: 'DELETE' })
      show(`${c.name} deleted`)
      await reload()
    } catch (e: any) {
      setErr(e.message)
    }
  }

  return (
    <>
      {toast}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1">{clients.length} total</p>
          <h1 className="font-display text-3xl font-semibold">Clients</h1>
        </div>
        <button
          onClick={() => setForm(form ? null : { mode: 'add' })}
          className="btn-primary px-5 py-2 text-sm"
        >
          {form ? 'close' : '+ add client'}
        </button>
      </div>

      {form && (
        <Modal title={form.mode === 'edit' ? 'edit client' : 'add client'} onClose={() => setForm(null)}>
          <ErrorBox msg={err} />
          <form onSubmit={submitClient} className="grid gap-4">
            <label className="block text-sm font-medium">
              Name
              <input
                name="name"
                required
                defaultValue={form.client?.name}
                placeholder="Aggarwal Traders"
                className={`${inputCls} mt-1`}
              />
            </label>
            <label className="block text-sm font-medium">
              GSTIN
              <input
                name="gstin"
                defaultValue={form.client?.gstin ?? ''}
                placeholder="27ABCDE1234F1Z5"
                className={`${inputCls} mt-1`}
              />
            </label>
            <button className="btn-primary">
              {form.mode === 'edit' ? 'save changes' : 'add client'}
            </button>
          </form>
        </Modal>
      )}

      <section className="card-glass overflow-hidden">
        <table className="hidden w-full text-left text-sm md:table">
          <thead>
            <tr className="border-b border-line/70 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              <th className="px-6 py-4 font-normal">client</th>
              <th className="px-6 py-4 font-normal">gstin</th>
              <th className="px-6 py-4 font-normal">filings</th>
              <th className="px-6 py-4 text-right font-normal">overdue</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-ink-muted">
                  no clients yet.
                </td>
              </tr>
            )}
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-line/40 last:border-0 hover:bg-white/50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-ink-muted">{c.gstin ?? 'unregistered'}</td>
                <td className="px-6 py-4 text-ink-body">{c.total ?? 0}</td>
                <td className="px-6 py-4 text-right">
                  {c.overdue ? (
                    <span className="mr-3 rounded-full bg-accent-orange/10 px-2.5 py-1 font-mono text-[10px] text-accent-orange">
                      {c.overdue} overdue
                    </span>
                  ) : (
                    <span className="mr-3 font-mono text-xs text-ink-muted">none</span>
                  )}
                  <button
                    onClick={() => setForm({ mode: 'edit', client: c })}
                    className="font-mono text-xs text-accent-blue hover:underline"
                  >
                    edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid gap-4 p-2 sm:grid-cols-2 md:hidden">
          {clients.length === 0 && (
            <p className="p-6 text-center text-sm text-ink-muted sm:col-span-2">no clients yet.</p>
          )}
          {clients.map((c) => (
            <div key={c.id} className="rounded-container bg-white/60 p-5">
              <p className="truncate text-sm font-medium">{c.name}</p>
              <p className="mt-1 font-mono text-xs text-ink-muted">{c.gstin ?? 'unregistered'}</p>
              <p className="mt-2 text-xs text-ink-body">
                {c.total ?? 0} filings
                {c.overdue ? (
                  <span className="ml-2 rounded-full bg-accent-orange/10 px-2 py-0.5 font-mono text-[10px] text-accent-orange">
                    {c.overdue} overdue
                  </span>
                ) : null}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
