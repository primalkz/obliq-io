# obliq agents

early startup assignment (round 2, founding engineer role). landing + auth + 1-2 features
for obliq, an AI compliance ops platform for indian CA firms.

## design

all visual work follows DESIGN.md exactly. read it before touching frontend. key rules:
warm palette (#1a1615 ink on #fafafa canvas, sky gradient), open runde for headings,
fragment mono for eyebrows/logo, everything rounded (pill buttons, 24px cards), warm brown
haze shadows, no pure black/white. soft scroll animations, transform and opacity only,
respect prefers-reduced-motion.

## code style (hard rules)

- KISS and DRY. minimal code, smallest diff that works. a pro linux dev wrote this.
- no multi-line comments. short lowercase comments only when truly needed.
- no em dashes in copy. straight quotes. human writing, slight informality ok.
- prefer simple common patterns over clever ones. stdlib over deps.
- inconsistencies are fine and human: sometimes no trailing newline concerns, mixed
  abbreviation, occasional missing capital in comments.
- commit style: small focused commits. gaps between commits should roughly match the
  size and difficulty of the change for an intermediate dev (big refactor = longer gap).
- reference app for backend patterns: D:\Development\Job_As (express 5 + prisma + zod +
  httpOnly cookie jwt). reuse its structure: thin routers, AppError + one errorHandler,
  zod validate middleware, prisma singleton, default-exported app for vercel.
