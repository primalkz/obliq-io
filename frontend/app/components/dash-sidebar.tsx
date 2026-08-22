'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarBlank, GearSix, ShieldCheck, SignOut, SquaresFour, Users } from '@phosphor-icons/react'
import { Logo } from './logo'
import { api } from '../lib'

export default function DashSidebar({
  me,
  active,
}: {
  me: { name: string; role?: string } | null
  active: 'home' | 'calendar' | 'clients' | 'settings' | 'admin'
}) {
  const router = useRouter()

  async function logout() {
    await api('/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const item = (key: typeof active, label: string, Icon: typeof CalendarBlank) => {
    const on = active === key
    const href = key === 'home' ? '/dashboard' : `/dashboard?tab=${key}`
    return (
      <Link
        key={key}
        href={href}
        className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left font-display text-sm font-medium transition-colors ${
          on ? 'bg-ink text-white' : 'text-ink-body hover:bg-white/70'
        }`}
      >
        <Icon size={18} weight={on ? 'fill' : 'regular'} />
        {label}
      </Link>
    )
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col justify-between border-r border-line/70 bg-white/50 p-5 backdrop-blur md:flex">
      <div>
        <Link href="/" className="block px-1">
          <Logo className="!h-8" />
        </Link>
        <nav className="mt-10 space-y-1">
          {item('home', 'Dashboard', SquaresFour)}
          {item('calendar', 'Calendar', CalendarBlank)}
          {item('clients', 'Clients', Users)}
          {item('settings', 'Settings', GearSix)}
          {me?.role === 'ADMIN' && item('admin', 'Admin', ShieldCheck)}
        </nav>
      </div>
      <div className="rounded-container bg-white/70 p-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
            {me?.name?.[0]?.toUpperCase()}
          </span>
          <p className="min-w-0 truncate text-sm font-medium">{me?.name}</p>
        </div>
        <button
          onClick={logout}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-line px-3 py-2 text-xs font-medium text-ink-body transition-colors hover:border-accent-orange/30 hover:bg-accent-orange/10 hover:text-accent-orange"
        >
          <SignOut size={13} /> log out
        </button>
      </div>
    </aside>
  )
}
