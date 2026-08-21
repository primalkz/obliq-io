# obliq design language

reference: https://obliqq.framer.ai/ (built on the "freelio" framer template). this is the
single source of truth for anything visual. vibe in 3 words: atmospheric, soft-technical,
anti-corporate.

## palette

no pure black or white anywhere. warm near-black on warm near-white, sky gradient for depth.

canvas / background gradient (vertical, hero to below fold):

```css
background: linear-gradient(#fafafa 0%, #f9f8f8 36%, #f4f1ee 45% 51%, #e2ecf6 73%, #a7cbf2 125%);
```

| role | value | notes |
|---|---|---|
| canvas top | `#fafafa` | warm off-white, page base |
| canvas mid | `#f4f1ee` | warm parchment |
| horizon | `#e2ecf6` | pale blue where content meets sky |
| deep sky | `#a7cbf2` | cerulean below fold |
| sky variant | `#9cc1e7` | more saturated sky |
| ink (text + buttons) | `#1a1615` | warm near-black, brown undertone |
| muted text | `#757170` | warm grey |
| body text secondary | `#453f3d` | darker warm grey |
| border light | `#e3e1e1` | 1px solid |
| border subtle | `rgba(117,115,114,0.15)` | footer dividers |
| card surface | `rgba(255,255,255,0.7)` + `backdrop-blur(10px)` | frosted glass |
| footer surface | `rgba(255,255,255,0.25)` + `backdrop-blur(5px)` | softer glass |
| accent green | `#0ea158` | success, positive deltas |
| accent blue | `#156cc2` | links |
| accent orange | `#c9502e` | sparingly, highlights |
| warm brown | `#614a44` | shadow tint only |

## shadow

one shadow everywhere. warm brown haze, not grey drop:

```css
box-shadow: 0px 4px 50px 0px rgba(97, 74, 68, 0.1);
```

## type

| role | font | weight |
|---|---|---|
| headings / buttons | open runde | 600 |
| body / ui | inter | 400 / 700 |
| logo, eyebrows, mono labels | fragment mono | 400 |

scale: 12, 14, 15, 16, 18, 20, 24, 28, 32, 40, then h1 jumps to 64 desktop / 44 mobile.
display line-height ~1.1, body 1.5. heading tracking -0.02em to 0. fragment mono keeps its
own wide tracking, never tighten it.

## shape

everything rounded. zero sharp corners anywhere.

pill buttons 100px · cards 24px · containers 20px · icons 16px · badges 10px · footer block 32px

borders are always 1px solid, light grey or transparent (glass cards keep stroke geometry).

## motifs

- pixelated logo: wordmark in fragment mono, icon rendered with `image-rendering: pixelated`.
  retro-digital tension against the soft sky. "technical precision meets approachable calm".
- real cloud pngs, absolutely positioned left/right behind content, drift outward on scroll
  (`translateX(-40px)` → `-200px`). parallax expansion.
- glassmorphic cards floating over the sky gradient.
- dashboard screenshot in hero, tilts up in 3d (rotateX/Y) as you scroll, settles flat.
- scroll-driven section reveals: each feature section's animation completes while it holds
  viewport attention before the next section takes over. spring-based, transform+opacity only,
  respect prefers-reduced-motion.
- centered layout, organic asymmetry from cloud imagery only.

## copy voice (from their site)

hero: "Compliance work breaks before filing."
sub: CA firms manage dozens of recurring deadlines across multiple clients. The challenge is
rarely filing itself, it's delayed documents, fragmented follow-ups, and poor visibility
before deadlines become risky.
ctas: "Try Obliq free" (dark pill) + "See features" (translucent pill). short declarative
sentences. problem-first, plain english, no hype words.

## tailwind mapping

```js
colors: {
  canvas: { top: '#fafafa', mid: '#f4f1ee', horizon: '#e2ecf6', deep: '#a7cbf2' },
  ink:    { DEFAULT: '#1a1615', muted: '#757170', body: '#453f3d' },
  warm:   { 50: '#f4f1ee', 100: '#f0eae5', 500: '#614a44' },
},
fontFamily: {
  display: ['"Open Runde"', 'sans-serif'],
  body:    ['Inter', 'sans-serif'],
  mono:    ['"Fragment Mono"', 'monospace'],
},
borderRadius: { card: '24px', container: '20px', pill: '100px' },
boxShadow:    { warm: '0px 4px 50px 0px rgba(97,74,68,0.1)' },
backgroundImage: { sky: 'linear-gradient(#fafafa 0%, #f9f8f8 36%, #f4f1ee 45% 51%, #e2ecf6 73%, #a7cbf2 125%)' },
```
