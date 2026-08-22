import Link from 'next/link'
import Image from 'next/image'
import { Logo } from './logo'

export default function AuthShell({
  title,
  sub,
  children,
}: {
  title: string
  sub: string
  children: React.ReactNode
}) {
  return (
    <main className="grid min-h-[100dvh] md:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-sky md:flex md:flex-col md:justify-between md:p-12">
        <Image
          src="/cloud-left.png"
          alt=""
          width={480}
          height={262}
          className="pointer-events-none absolute -left-20 top-16 opacity-90 cloud-float"
        />
        <Image
          src="/cloud-right.png"
          alt=""
          width={560}
          height={305}
          className="pointer-events-none absolute -right-24 bottom-8 opacity-90 cloud-float-slow"
        />
        <Link href="/" className="relative">
          <Logo />
        </Link>
        <div className="relative">
          <p className="font-display text-4xl font-semibold leading-[1.1] tracking-[-0.02em]">
            Compliance work breaks before filing.
          </p>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-body">
            One calendar for every client deadline. Obliq shows what slips before it does.
          </p>
          <p className="mt-10 font-mono text-xs text-ink-muted">
            trusted by 1,200+ ca firms, startups and studios
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center bg-[#fafafa] px-6 py-14">
        <div className="w-full max-w-sm rise-in">
          <Link href="/" className="mb-8 block md:hidden">
            <Logo />
          </Link>
          <div className="card-glass p-6">
            <h1 className="font-display text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-ink-body">{sub}</p>
            {children}
          </div>
        </div>
      </section>
    </main>
  )
}
