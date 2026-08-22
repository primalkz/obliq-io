'use client'

import Link from 'next/link'
import Image from 'next/image'
import { InstagramLogo, LinkedinLogo, XLogo } from '@phosphor-icons/react'
import { Logo } from './logo'

const cols = [
  { head: 'product', links: [['features', '#features'], ['benefits', '#benefits'], ['pricing', '#pricing']] },
  { head: 'information', links: [['try free', '/register'], ['sign in', '/login'], ['dashboard', '/dashboard']] },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-sky">
      <Image
        src="/cloud-left.png"
        alt=""
        width={480}
        height={262}
        className="pointer-events-none absolute -left-24 top-10 opacity-90"
      />
      <Image
        src="/cloud-right.png"
        alt=""
        width={560}
        height={305}
        className="pointer-events-none absolute -right-28 bottom-0 opacity-90"
      />

      <div className="relative mx-auto max-w-5xl px-6 pb-10 pt-24 text-center">
        <h2 className="mx-auto max-w-md font-display text-[32px] font-semibold leading-tight md:text-[40px]">
          Stop finding out late.
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-[15px] text-ink-body">
          Set up your firm&apos;s compliance calendar in an afternoon. First 5 clients are free.
        </p>
        <Link href="/register" className="btn-primary mt-8">
          Try Obliq free
        </Link>

        <div className="footer-glass mt-16 p-10 text-left md:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_auto]">
            <div>
              <Logo />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-body">
                Your favourite compliance ops software. Built for Indian CA firms.
              </p>
              <div className="mt-5 flex gap-3">
                {[
                  { icon: <LinkedinLogo size={16} weight="fill" />, label: 'linkedin' },
                  { icon: <InstagramLogo size={16} weight="fill" />, label: 'instagram' },
                  { icon: <XLogo size={16} weight="fill" />, label: 'x' },
                ].map((s) => (
                  <span
                    key={s.label}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-ink text-white transition-transform hover:-translate-y-0.5"
                    aria-label={s.label}
                  >
                    {s.icon}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-16">
              {cols.map((c) => (
                <div key={c.head}>
                  <p className="font-mono text-xs uppercase tracking-widest text-ink">{c.head}</p>
                  <ul className="mt-4 space-y-2.5 text-sm text-ink-body">
                    {c.links.map(([label, href]) => (
                      <li key={label}>
                        <Link href={href} className="transition-colors hover:text-ink">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[rgba(117,113,114,0.15)] pt-6 text-xs text-ink-muted sm:flex-row">
            <p>© {new Date().getFullYear()} Obliq. Built for Indian CA firms.</p>
            <p className="font-mono">compliance, minus the chaos</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
