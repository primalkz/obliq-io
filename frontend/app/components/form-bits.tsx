'use client'

export const inputCls =
  'mt-1 w-full rounded-container border border-line bg-white/80 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-ink-muted focus:border-ink/40'

export const tone: Record<string, string> = {
  OVERDUE: 'bg-accent-orange/10 text-accent-orange',
  UPCOMING: 'bg-accent-blue/10 text-accent-blue',
  FILED: 'bg-accent-green/10 text-accent-green',
}

export function ErrorBox({ msg }: { msg: string }) {
  if (!msg) return null
  return <p className="rounded-container bg-accent-orange/10 px-4 py-2.5 text-sm text-accent-orange">{msg}</p>
}
