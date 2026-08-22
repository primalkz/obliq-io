'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const rows = [
  {
    tag: 'one calendar',
    title: 'Every client, every deadline, one place',
    body: 'GST, TDS, PF, ESI, ITR. Recurring work shows up as a single timeline instead of a dozen excel sheets and whatsapp reminders.',
    visual: (
      <div className="space-y-2 font-mono text-xs">
        {[
          ['gstr 3b', 'shree ganesh textiles', 'text-accent-orange'],
          ['itr 3', 'kulkarni foods', 'text-accent-blue'],
          ['tds 26q', 'verma solar', 'text-accent-blue'],
        ].map(([what, who, tone]) => (
          <div key={what} className="flex items-center justify-between rounded-container bg-white/70 px-4 py-3">
            <span className="font-semibold">{what}</span>
            <span className="hidden text-ink-muted sm:inline">{who}</span>
            <span className={tone}>●</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: 'no surprises',
    title: 'Know what slips before it slips',
    body: 'Filings age into overdue on their own. Risky clients float to the top so monday morning starts with the right work.',
    flip: true,
    visual: (
      <div className="card-glass p-6">
        <p className="eyebrow !text-[10px]">this week</p>
        <p className="mt-3 font-display text-4xl font-semibold">
          3 <span className="text-base font-normal text-ink-muted">filings due</span>
        </p>
        <div className="mt-4 flex gap-2">
          <span className="rounded-full bg-accent-orange/10 px-3 py-1 font-mono text-[10px] text-accent-orange">
            1 overdue
          </span>
          <span className="rounded-full bg-accent-green/10 px-3 py-1 font-mono text-[10px] text-accent-green">
            12 filed this month
          </span>
        </div>
      </div>
    ),
  },
  {
    tag: 'less chasing',
    title: 'Documents chased, not people',
    body: 'Each filing tracks its own status. When something is stuck with a client you see exactly what is pending and since when.',
    visual: (
      <div className="space-y-2 font-mono text-xs">
        {[
          ['esi contribution', 'stuck 9 days', 'text-accent-orange'],
          ['advance tax', 'docs received', 'text-accent-green'],
          ['gstr 9', 'with client', 'text-ink-muted'],
        ].map(([what, st, tone]) => (
          <div key={what} className="flex items-center justify-between rounded-container bg-white/70 px-4 py-3">
            <span className="font-semibold">{what}</span>
            <span className={tone}>{st}</span>
          </div>
        ))}
      </div>
    ),
  },
]

export default function Features() {
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-fade-up]').forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel, i) => {
        gsap.fromTo(
          panel,
          { y: 40 + i * 10 },
          {
            y: -40 - i * 10,
            ease: 'none',
            scrollTrigger: { trigger: panel, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    }, wrap)
    return () => ctx.revert()
  }, [])

  return (
    <section id="features" ref={wrap} className="mx-auto max-w-5xl px-6 py-28">
      <div data-fade-up>
        <p className="eyebrow mb-3 text-center">features</p>
        <h2 className="mx-auto max-w-xl text-center font-display text-[32px] font-semibold leading-tight md:text-[40px]">
          Built around how compliance actually fails
        </h2>
      </div>
      <div className="mt-20 space-y-10 md:space-y-16">
        {rows.map((r, i) => (
          <div key={r.tag} data-fade-up>
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div className={r.flip ? 'md:order-2' : ''}>
                <p className="eyebrow mb-3">{r.tag}</p>
                <h3 className="font-display text-2xl font-semibold md:text-[28px]">{r.title}</h3>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-body">{r.body}</p>
              </div>
              <div
                data-panel
                className={`rounded-[32px] bg-gradient-to-b from-canvas-horizon to-canvas-deep p-5 will-change-transform md:p-8 ${r.flip ? 'md:order-1' : ''}`}
              >
                <div className="card-glass p-5 md:p-6">{r.visual}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
