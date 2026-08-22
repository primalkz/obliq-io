'use client'

import { useRef, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { PaperPlaneRight, Sparkle } from '@phosphor-icons/react'

const prompts = [
  'summarise this week',
  'which clients are overdue?',
  'what is due in the next 7 days?',
]

type Turn = { role: 'user' | 'assistant'; content: string }

export default function InsightCard() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [q, setQ] = useState('')
  const thread = useRef<HTMLDivElement>(null)

  async function ask(question: string) {
    if (!question.trim() || loading) return
    setLoading(true)
    setErr('')
    const history = turns.slice(-6)
    setTurns([...turns, { role: 'user', content: question }])
    setQ('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'}/agent`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, history }),
        },
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'request failed')
      setTurns((t) => [...t, { role: 'assistant', content: json.answer }])
      setTimeout(() => thread.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 50)
    } catch (e: any) {
      setErr(e.message)
      setTurns((t) => t.slice(0, -1))
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

      {turns.length > 0 && (
        <div
          ref={thread}
          className="mt-4 max-h-72 space-y-3 overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,black_8%)]"
        >
          {turns.map((t, i) => (
            <div
              key={i}
              className={`rise-in max-w-[75%] rounded-container px-4 py-3 text-sm leading-relaxed ${
                t.role === 'user'
                  ? 'ml-auto bg-ink text-white'
                  : 'bg-white/80 text-ink-body [&_strong]:font-semibold [&_li]:ml-4 [&_ul]:list-disc [&_a]:text-accent-blue [&_a]:underline'
              }`}
            >
              {t.role === 'assistant' ? (
                <Markdown remarkPlugins={[remarkGfm]}>{t.content}</Markdown>
              ) : (
                t.content
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-1.5 px-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-ink-muted"
                  style={{ animation: `dot-bounce 1s ${i * 0.15}s infinite` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          ask(q)
        }}
        className="mx-auto mt-4 flex max-w-xl gap-2"
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

      {turns.length === 0 && !loading && (
        <div className="mt-3 flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button
              key={p}
              onClick={() => ask(p)}
              className="rounded-full bg-white/70 px-3 py-1.5 font-mono text-[11px] text-ink-body transition-colors hover:bg-white"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {err && <p className="mt-3 rounded-container bg-accent-orange/10 px-4 py-2.5 text-sm text-accent-orange">{err}</p>}
    </section>
  )
}
