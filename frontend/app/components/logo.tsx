import Image from 'next/image'

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Obliq.io"
      width={191}
      height={68}
      priority
      className={`h-6 w-auto select-none md:h-7 ${className}`}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
