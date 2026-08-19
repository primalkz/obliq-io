import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
import './globals.css'

const runde = localFont({
  variable: '--font-runde',
  src: [
    { path: './fonts/runde-400.woff2', weight: '400' },
    { path: './fonts/runde-500.woff2', weight: '500' },
    { path: './fonts/runde-600.woff2', weight: '600' },
  ],
})

const fragment = localFont({
  variable: '--font-fragment',
  src: './fonts/fragment-mono.woff2',
})

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Obliq.io',
  description: 'AI-powered compliance operations for Indian CA firms',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${runde.variable} ${inter.variable} ${fragment.variable} font-body text-ink`}>
        {children}
      </body>
    </html>
  )
}
