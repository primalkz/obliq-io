'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import DashMock from './dash-mock'

const firms = [
  { name: 'Mahajan & Co.', icon: '●', cls: 'text-lg font-semibold' },
  { name: 'RATHI MEHTA', cls: 'font-display text-lg font-bold tracking-widest' },
  { name: 'Gupta Verma', icon: '▣', cls: 'text-lg font-semibold' },
  { name: 'krishnan rao', icon: '✦', cls: 'text-lg font-medium lowercase' },
  { name: 'shetty.', cls: 'font-display text-xl font-bold' },
  { name: 'BHATIA', icon: '◇', cls: 'font-mono text-base tracking-[0.3em]' },
]

export default function Hero() {
  const wrap = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const tick = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / 400))
      if (card.current) {
        card.current.style.transform = `perspective(1200px) rotateX(${(1 - p) * 14}deg) scale(${1 - p * 0.04})`
      }
      wrap.current?.querySelectorAll<HTMLElement>('[data-cloud]').forEach((c) => {
        const dir = c.dataset.cloud === 'left' ? -1 : 1
        c.style.transform = `translateX(${(-40 - p * 160) * dir}px)`
      })
      raf = 0
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    addEventListener('scroll', onScroll, { passive: true })
    tick()
    return () => {
      removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={wrap}
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-sky pb-8 pt-36 text-center"
    >
      <Image
        src="/cloud-left.png"
        alt=""
        data-cloud="left"
        width={480}
        height={262}
        className="pointer-events-none absolute -left-24 top-24 opacity-90 will-change-transform"
      />
      <Image
        src="/cloud-right.png"
        alt=""
        data-cloud="right"
        width={560}
        height={305}
        className="pointer-events-none absolute -right-28 top-48 opacity-90 will-change-transform"
      />

      <div className="relative mx-auto max-w-3xl px-6">
        <p className="eyebrow mb-5">built for indian ca firms</p>
        <h1 className="font-display text-[44px] font-semibold leading-[1.06] tracking-[-0.02em] md:text-[64px]">
          Compliance work breaks before filing.
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-ink-body">
          Recurring deadlines across dozens of clients are hard to track. Obliq shows what slips
          before it does.
        </p>
        <div className="mt-9 flex items-center justify-center gap-4">
          <Link href="/register" className="btn-primary px-7 py-3.5 text-base">
            Try Obliq free
          </Link>
          <a href="#features" className="btn-ghost px-7 py-3.5 text-base">
            See features
          </a>
        </div>
      </div>

      <div ref={card} className="relative mx-auto mt-20 flex justify-center will-change-transform">
        <DashMock />
      </div>

      <div className="relative mt-auto pt-14">
        <p className="font-mono text-xs text-ink-body">
          trusted by 1,200+ ca firms, startups and studios
        </p>
        <div className="mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="marquee flex w-max items-center gap-16 pr-16">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex shrink-0 items-center gap-16">
                {firms.map((f) => (
                  <span key={f.name} className={`flex items-center gap-2.5 whitespace-nowrap text-ink-muted ${f.cls}`}>
                    {f.icon && <span aria-hidden>{f.icon}</span>}
                    {f.name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="marquee flex w-max gap-10 font-mono text-xs uppercase tracking-widest text-ink-muted">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex shrink-0 gap-10">
                {['gst r1', 'gst 3b', 'tds 26q', 'itr 1', 'itr 3', 'pf ecr', 'esi', 'advance tax', 'tax audit 44ab', 'gstr 9'].map(
                  (t) => (
                    <span key={t} className="flex items-center gap-10">
                      {t}
                      <span aria-hidden>·</span>
                    </span>
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
