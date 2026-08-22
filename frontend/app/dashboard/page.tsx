'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Logo } from '../components/logo'
import DashSidebar from '../components/dash-sidebar'
import { api } from '../lib'
import CalendarView from './calendar'
import ClientsView from './clients'
import SettingsView from './settings'
import AdminView from './admin'
import type { Filing, Client } from './shared'

type Tab = 'home' | 'calendar' | 'clients' | 'settings' | 'admin'

export default function Dashboard() {
  return (
    <Suspense fallback={null}>
      <DashboardInner />
    </Suspense>
  )
}

function DashboardInner() {
  const router = useRouter()
  const search = useSearchParams()
  const [me, setMe] = useState<{ name: string; email: string } | null>(null)
  const [filings, setFilings] = useState<Filing[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const searchTab = search.get('tab') as Tab | null
  const tab: Tab = searchTab ?? 'home'

  const load = useCallback(async () => {
    try {
      const [f, c] = await Promise.all([api('/filings'), api('/clients')])
      setFilings(f)
      setClients(c)
    } catch {
      router.push('/login')
    }
  }, [router])

  useEffect(() => {
    api('/auth/me').then(setMe).catch(() => router.push('/login'))
    load()
  }, [load])

  return (
    <div className="min-h-[100dvh] bg-sky">
      <DashSidebar me={me} active={tab} />

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line/70 bg-white/50 px-6 py-3 backdrop-blur md:hidden">
        <Logo />
      </header>

      <main className="px-6 pb-20 pt-8 md:pl-[17rem] md:pr-10">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="flex gap-2 md:hidden">
            {(['home', 'calendar', 'clients', 'settings', 'admin'] as const).map((t) => (
              <button
                key={t}
                onClick={() => router.push(t === 'home' ? '/dashboard' : `/dashboard?tab=${t}`)}
                className={`flex-1 rounded-full px-4 py-2 font-display text-sm font-medium ${
                  tab === t ? 'bg-ink text-white' : 'bg-white/60 text-ink-body'
                }`}
              >
                {t[0].toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'home' && (
            <CalendarView me={me} filings={filings} clients={clients} reload={load} />
          )}
          {tab === 'calendar' && (
            <CalendarView me={me} filings={filings} clients={clients} reload={load} gridOnly />
          )}
          {tab === 'clients' && <ClientsView clients={clients} reload={load} />}
          {tab === 'settings' && <SettingsView me={me} setMe={setMe} />}
          {tab === 'admin' && <AdminView />}
        </div>
      </main>
    </div>
  )
}
