import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: { top: '#fafafa', mid: '#f4f1ee', horizon: '#e2ecf6', deep: '#a7cbf2' },
        ink: { DEFAULT: '#1a1615', muted: '#757170', body: '#453f3d' },
        warm: { 50: '#f4f1ee', 100: '#f0eae5', 500: '#614a44' },
        line: '#e3e1e1',
        accent: { green: '#0ea158', blue: '#156cc2', orange: '#c9502e' },
      },
      fontFamily: {
        display: ['var(--font-runde)', 'sans-serif'],
        body: ['var(--font-satoshi)', 'sans-serif'],
        mono: ['var(--font-fragment)', 'monospace'],
      },
      borderRadius: { card: '24px', container: '20px' },
      boxShadow: {
        warm: '0px 4px 50px 0px rgba(97,74,68,0.1)',
        'warm-sm': '0px 2px 24px 0px rgba(97,74,68,0.08)',
      },
      backgroundImage: {
        sky: 'linear-gradient(#fafafa 0%, #f9f8f8 36%, #f4f1ee 45% 51%, #e2ecf6 73%, #a7cbf2 125%)',
      },
    },
  },
  plugins: [],
} satisfies Config
