'use client'

import { useEffect, useState } from 'react'
import { Trash } from '@phosphor-icons/react'
import { api } from '../lib'

type AdminUser = {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
  clients: number
}

export default function AdminView() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [err, setErr] = useState('')

  async function load() {
    try {
      setUsers(await api('/admin/users'))
    } catch (e: any) {
      setErr(e.message)
    }
  }

  useEffect(() => { load() }, [])

  async function remove(u: AdminUser) {
    if (!confirm(`delete ${u.name} (${u.email}) and all their data?`)) return
    try {
      setErr('')
      await api(`/admin/users/${u.id}`, { method: 'DELETE' })
      load()
    } catch (e: any) {
      setErr(e.message)
    }
  }

  return (
    <>
      <div>
        <p className="eyebrow mb-1">platform admin</p>
        <h1 className="font-display text-3xl font-semibold">Users</h1>
      </div>

      {err && <p className="rounded-container bg-accent-orange/10 px-4 py-2.5 text-sm text-accent-orange">{err}</p>}

      <section className="card-glass overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line/70 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              <th className="px-6 py-4 font-normal">user</th>
              <th className="px-6 py-4 font-normal">email</th>
              <th className="px-6 py-4 font-normal">role</th>
              <th className="px-6 py-4 font-normal">clients</th>
              <th className="px-6 py-4 text-right font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line/40 transition-colors last:border-0 hover:bg-white/50">
                <td className="px-6 py-4 font-medium">{u.name}</td>
                <td className="px-6 py-4 text-ink-body">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2.5 py-1 font-mono text-[10px] ${u.role === 'ADMIN' ? 'bg-accent-blue/10 text-accent-blue' : 'bg-white/70 text-ink-body'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-ink-body">{u.clients}</td>
                <td className="px-6 py-4 text-right">
                  {u.role !== 'ADMIN' && (
                    <button onClick={() => remove(u)} className="font-mono text-xs text-accent-orange hover:underline">
                      <Trash size={13} className="inline" /> delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  )
}