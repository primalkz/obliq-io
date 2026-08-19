'use client'

import { useEffect, useRef } from 'react'

const fromCls: Record<string, string> = {
  up: 'translate-y-8',
  left: '-translate-x-10',
  right: 'translate-x-10',
  scale: 'scale-[0.94]',
}

export default function Reveal({
  children,
  delay = 0,
  from = 'up',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  from?: keyof typeof fromCls
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        el.style.transitionDelay = `${delay}ms`
        el.style.opacity = '1'
        el.style.transform = 'none'
        io.disconnect()
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`opacity-0 ${fromCls[from]} transition-[opacity,transform] duration-700 ease-out ${className}`}
    >
      {children}
    </div>
  )
}
