'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Logo } from './logo'
import { api } from '../lib'

const links = [
  ['Features', '#features'],
  ['Benefits', '#benefits'],
  ['Pricing', '#pricing'],
]

export default function Nav() {
  const [user, setUser] = useState<{ name: string } | null | 'checking'>('checking')

  useEffect(() => {
    api('/auth/me').then(setUser).catch(() => setUser(null))
  }, [])

  return (
    <header className="fixed inset-x-0 top-4 z-50 mx-auto flex max-w-5xl items-center justify-between rounded-full bg-white/60 px-6 py-3 shadow-warm-sm backdrop-blur">
      <Link href="/" className="flex items-center gap-2">
        <Logo />
      </Link>
      <nav className="hidden gap-8 text-[15px] text-ink-body md:flex">
        {links.map(([label, href]) => (
          <a key={href} href={href} className="transition-colors hover:text-ink">
            {label}
          </a>
        ))}
      </nav>
      {user === 'checking' ? (
        <span className="h-9 w-28 animate-pulse rounded-full bg-white/60" />
      ) : user ? (
        <Link href="/dashboard" className="btn-primary px-5 py-2">
          Dashboard
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost px-5 py-2 text-sm">
            Sign in
          </Link>
          <Link href="/register" className="btn-primary px-5 py-2 text-sm">
            Try Obliq free
          </Link>
        </div>
      )}
    </header>
  )
}
