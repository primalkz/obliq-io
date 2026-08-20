import { tone } from './form-bits'

const stats = [
  { label: 'active clients', n: '24' },
  { label: 'filings this month', n: '18' },
  { label: 'filed on time', n: '96%' },
  { label: 'overdue', n: '3', alert: true },
]

const bars = [
  ['apr', 62],
  ['may', 74],
  ['jun', 55],
  ['jul', 88],
  ['aug', 96],
  ['sep', 41],
  ['oct', 67],
] as const

const upcoming = [
  { what: 'GSTR-3B', who: 'Nandi Logistics', due: 'fri', status: 'UPCOMING' },
  { what: 'TDS 26Q', who: 'Verma Solar', due: 'mon', status: 'UPCOMING' },
  { what: 'PF ECR', who: 'Kulkarni Foods', due: '15th', status: 'UPCOMING' },
  { what: 'GSTR-1', who: 'Mehta Jewellers', due: '11th', status: 'OVERDUE' },
]

export default function DashMock() {
  return (
    <div className="card-glass w-full max-w-6xl overflow-hidden text-left">
      <div className="flex">
        <aside className="hidden w-52 shrink-0 flex-col gap-1 border-r border-line/70 bg-white/60 p-4 sm:flex">
          <p className="mb-4 px-2 font-mono text-sm font-bold">OBLIQ</p>
          {['home', 'clients', 'filings', 'calendar'].map((x, i) => (
            <span
              key={x}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${i === 2 ? 'bg-ink text-white' : 'text-ink-muted'}`}
            >
              {x}
            </span>
          ))}
          <span className="mt-6 px-3 font-mono text-[9px] uppercase tracking-widest text-ink-muted">tools</span>
          {['reports', 'invoices'].map((x) => (
            <span key={x} className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-muted">
              {x}
            </span>
          ))}
        </aside>

        <div className="min-w-0 flex-1 space-y-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg font-semibold">Hello, Aarti</p>
              <p className="text-xs text-ink-muted">aug 2026 · 18 filings in flight</p>
            </div>
            <span className="hidden rounded-full bg-ink px-3 py-1.5 font-mono text-[10px] text-white sm:block">
              0:42:18
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-container bg-white/70 px-3.5 py-3">
                <p className="truncate text-[10px] text-ink-muted">{s.label}</p>
                <p className={`font-display text-2xl font-semibold ${s.alert ? 'text-accent-orange' : ''}`}>
                  {s.n}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-2.5 md:grid-cols-5">
            <div className="rounded-container bg-white/70 p-4 md:col-span-3">
              <p className="text-sm font-medium">filings per month</p>
              <div className="mt-3 flex h-36 items-end gap-2.5">
                {bars.map(([m, v]) => (
                  <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                    <div
                      className={`w-full rounded-t-md ${v >= 88 ? 'bg-ink' : 'bg-ink/15'}`}
                      style={{ height: `${v}%` }}
                    />
                    <span className="font-mono text-[8px] text-ink-muted">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-container bg-white/70 p-4 md:col-span-2">
              <p className="text-sm font-medium">up next</p>
              <div className="mt-2.5 space-y-1.5">
                {upcoming.map((u) => (
                  <div key={u.what} className="flex items-center justify-between gap-2 text-[11px]">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{u.what}</p>
                      <p className="truncate text-[10px] text-ink-muted">{u.who}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[8px] ${tone[u.status]}`}>
                      {u.due}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
