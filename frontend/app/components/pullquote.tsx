import Reveal from './reveal'

export default function PullQuote() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-8 pt-12 text-center">
      <Reveal from="scale">
        <p className="eyebrow mb-8">why firms switch</p>
        <blockquote className="font-display text-[30px] font-semibold leading-[1.15] tracking-[-0.01em] md:text-[46px]">
          &ldquo;We stopped finding out about missed deadlines from ca notices.&rdquo;
        </blockquote>
        <figcaption className="mt-8">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-sm font-semibold text-white">
            RK
          </span>
          <p className="mt-3 text-sm font-medium">Rakesh Iyer</p>
          <p className="text-xs text-ink-muted">Partner, Iyer &amp; Co.</p>
        </figcaption>
      </Reveal>
    </section>
  )
}
