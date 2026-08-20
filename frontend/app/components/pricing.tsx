import Link from 'next/link'
import Reveal from './reveal'

const plans = [
  {
    name: 'Starter',
    price: '₹0',
    per: '/mo',
    line: 'For solo CAs testing the waters.',
    points: ['Up to 5 clients', 'Compliance calendar', 'Overdue alerts'],
    cta: 'Start free',
  },
  {
    name: 'Firm',
    price: '₹1,499',
    per: '/mo',
    line: 'For growing firms with real volume.',
    points: ['Unlimited clients', 'Document follow-ups', 'Firm-wide visibility'],
    cta: 'Try Obliq free',
    featured: true,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-2xl px-6 py-28">
      <Reveal>
        <h2 className="text-center font-display text-[32px] font-semibold leading-tight md:text-[40px]">
          Costs less than one penalty
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 120}>
            <div className={`card-glass h-full p-8 ${p.featured ? 'ring-1 ring-ink/20' : ''}`}>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted">{p.name}</p>
              <p className="mt-4 font-display text-4xl font-semibold">
                {p.price}
                <span className="text-base font-normal text-ink-muted">{p.per}</span>
              </p>
              <p className="mt-2 text-sm text-ink-body">{p.line}</p>
              <ul className="mt-6 space-y-2 text-[15px] text-ink-body">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2">
                    <span className="text-accent-green">✓</span>
                    {pt}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={`${p.featured ? 'btn-primary' : 'btn-ghost'} mt-8 w-full`}>
                {p.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
