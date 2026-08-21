'use client'

import { useState } from 'react'
import { PaperPlaneRight, Sparkle } from '@phosphor-icons/react'

const prompts = [
  'summarise this week',
  'which clients are overdue?',
  'what is due in the next 7 days?',
]

export default function InsightCard() {
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')

  async function ask(question: string) {
    if (!question.trim() || loading) return
    setLoading(true)
    setErr('')
    setAnswer('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'}/agent`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        },
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'request failed')
      setAnswer(json.answer)
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card-glass p-6">
      <div className="flex items-center gap-2">
        <Sparkle size={16} weight="fill" className="text-accent-blue" />
        <p className="font-display text-sm font-semibold">ask obliq</p>
        <span className="ml-auto font-mono text-[10px] text-ink-muted">qwen 3.6 · groq</span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          ask(q)
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ask anything about your calendar"
          className="w-full rounded-full border border-line bg-white/80 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink-muted focus:border-ink/40"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary shrink-0 !px-4 !py-2.5 disabled:opacity-50"
          aria-label="ask"
        >
          <PaperPlaneRight size={16} weight="fill" />
        </button>
      </form>

      {!answer && !loading && !err && (
        <div className="mt-3 flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => {
                setQ(p)
                ask(p)
              }}
              className="rounded-full bg-white/70 px-3 py-1.5 font-mono text-[11px] text-ink-body transition-colors hover:bg-white"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="mt-4 flex items-center gap-1.5 px-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-ink-muted"
              style={{ animation: `dot-bounce 1s ${i * 0.15}s infinite` }}
            />
          ))}
          <span className="ml-2 text-xs text-ink-muted">checking the calendar</span>
        </div>
      )}

      {err && <p className="mt-4 rounded-container bg-accent-orange/10 px-4 py-2.5 text-sm text-accent-orange">{err}</p>}

      {answer && !loading && (
        <p className="rise-in mt-4 rounded-container bg-white/70 px-4 py-3.5 text-[15px] leading-relaxed text-ink-body">
          {answer}
        </p>
      )}
    </section>
  )
}
