import Reveal from './reveal'

const quotes = [
  {
    quote:
      'We manage 60+ clients and earlier the GST calendar lived in three excels and one senior\'s head. Now it is one screen and I actually trust it.',
    name: 'Rakesh Iyer',
    role: 'Partner, Iyer & Co.',
  },
  {
    quote:
      'Overdue used to surface when a notice arrived. Now I see it two weeks early and have an awkward conversation instead of a penalty.',
    name: 'Sneha Kulkarni',
    role: 'Founder, SK Associates',
  },
  {
    quote:
      'Articles used to ask which client is pending. Now they just look at the board. Onboarding a new CA takes a week, not a quarter.',
    name: 'Mohit Bansal',
    role: 'Bansal & Associates',
  },
  {
    quote:
      'The overdue badge sounds like nothing until it saves you a lakh in interest. It paid for itself in the first month.',
    name: 'Priya Nair',
    role: 'CFO, Nair Exports',
  },
]

export default function Testimonials() {
  return (
    <section id="benefits" className="mx-auto max-w-4xl px-6 py-28">
      <Reveal>
        <h2 className="mx-auto max-w-lg text-center font-display text-[32px] font-semibold leading-tight md:text-[40px]">
          Fewer penalties, calmer mondays
        </h2>
      </Reveal>
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {quotes.map((q, i) => (
          <Reveal key={q.name} delay={(i % 2) * 120}>
            <figure className="card-glass h-full p-8">
              <blockquote className="text-[15px] leading-relaxed text-ink-body">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6">
                <p className="font-display text-sm font-semibold">{q.name}</p>
                <p className="text-xs text-ink-muted">{q.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
