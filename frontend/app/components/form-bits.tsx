'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'

export const inputCls =
  'mt-1 w-full rounded-container border border-line bg-white/80 px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-ink-muted focus:border-ink/40'

export const tone: Record<string, string> = {
  OVERDUE: 'bg-accent-orange/10 text-accent-orange',
  UPCOMING: 'bg-accent-blue/10 text-accent-blue',
  FILED: 'bg-accent-green/10 text-accent-green',
}

export function useToast() {
  const [msg, setMsg] = useState('')
  const show = (m: string) => {
    setMsg(m)
    setTimeout(() => setMsg(''), 2500)
  }
  const node =
    msg === '' ? null : (
      <div className="rise-in fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-warm">
        {msg}
      </div>
    )
  return { show, node }
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
}) {
  return createPortal(
    <div className="fixed inset-0 z-50">
      <button aria-label="close" onClick={onClose} className="absolute inset-0 bg-ink/20 backdrop-blur-sm" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
        <div className="rise-in pointer-events-auto max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-card bg-[#fafafa] p-6 shadow-warm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="font-mono text-xs text-ink-muted hover:text-ink">
              esc
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

export function ErrorBox({ msg }: { msg: string }) {
  if (!msg) return null
  return <p className="rounded-container bg-accent-orange/10 px-4 py-2.5 text-sm text-accent-orange">{msg}</p>
}
