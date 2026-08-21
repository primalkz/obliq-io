# obliq

Compliance ops for Indian CA firms. CA firms run dozens of recurring deadlines across clients.
The hard part is rarely the filing itself. It is delayed documents, scattered follow ups and no
visibility until a deadline turns risky. Obliq puts every client filing on one calendar and
shows what slips before it does.

| role | email | password |
|---|---|---|
| CA firm user | aarti@kumarassociates.in | obliqdemo1 |
| Admin | admin@obliq.io | obliqadmin1 |

This round covers the brief end to end: landing page, auth, database schema on Supabase
postgres, backend API for user management, a responsive dashboard, an AI agent ("Ask Obliq"),
and CI/CD with a Vercel deploy workflow. The optional RAG pipeline is out of scope, with the
implementation plan at the bottom.

Two apps in one repo:

- `backend/` Express 5 + Prisma + Postgres (Supabase). Thin routers, zod validation, httpOnly
  cookie JWT, role based admin.
- `frontend/` Next.js 14 app router + Tailwind. Landing, auth pages, dashboard with sidebar.

Full endpoint docs live in [docs/API.md](docs/API.md).

## task list

- [x] Build landing page + basic auth (email/password) for Obliq-io.
- [x] Design database schema (MongoDB / Supabase) for user profiles + applications.
- [x] Build first feature: CA firm automation tool (compliance tracker + Ask Obliq agent).
- [ ] Create RAG pipeline prototype (chunking -> embeddings -> pgvector / similar).
- [x] Build backend API (Node.js / Python) with basic endpoints for user management.
- [x] Set up CI/CD pipeline (GitHub Actions) + deployment script.
- [x] Build AI agent system prototype (LLM orchestration: Gemini + Groq / OpenAI).
- [x] Create responsive frontend (React / Next.js + TypeScript) for user dashboard.

## the feature

The first feature is the compliance tracker. A CA adds clients, adds statutory filings (GST,
TDS, PF, ESI, ITR) with due dates, and gets a month calendar plus a sorted list where every
filing is automatically marked UPCOMING, OVERDUE or FILED. Risky clients float to the top.

Ask Obliq sits on top of it. It is a small agent with tools to query the firm's own clients,
filings and stats, so you can ask "which clients are overdue?" or "give me the link to the PF
ECR filing" and get a real answer with a working link. Built on Groq's OpenAI-compatible chat
completions API with qwen 3.6, no agent framework.

## design

The look follows Obliq's own site. Warm palette instead of cold SaaS blues: ink `#1a1615` on
cream `#fafafa` melting into a pale sky gradient. Open Runde for headings, Satoshi for body,
Fragment Mono for the logo and small labels. Everything rounded (pill buttons, 24px glass
cards), one soft brown haze shadow instead of grey drops. Clouds drift on scroll, the hero
dashboard tilts flat as you pass it, panels reveal with GSAP ScrollTrigger. Motion is transform
and opacity only and respects reduced motion.

## demo credentials

| role | email | password |
|---|---|---|
| CA firm user | aarti@kumarassociates.in | obliqdemo1 |
| Admin | admin@obliq.io | obliqadmin1 |

## run it locally

Backend:

```
cp .env.example .env      # fill DATABASE_URL, JWT_SECRET, GROQ_API_KEY
npm install
npm run migrate           # creates tables
npm run db:seed           # demo firm, 6 clients, 15 filings, 1 admin
npm run dev               # :4000
```

Seed logins: aarti@kumarassociates.in / obliqdemo1 (normal) and admin@obliq.io / obliqadmin1
(admin).

Frontend:

```
npm install
npm run dev               # :3000
```

Set `NEXT_PUBLIC_API_URL` if the API is not on localhost:4000.

## schema

| table | key fields | notes |
|---|---|---|
| User | email, passwordHash, name, role (USER/ADMIN) | one account per CA |
| Client | name, gstin?, userId | belongs to a firm user, gstin optional |
| Filing | clientId, title, period?, dueDate, filedAt? | belongs to a client, dueDate indexed |

Filing status is never stored. It comes from dueDate and filedAt at read time (FILED if
filedAt is set, OVERDUE if the due date passed, else UPCOMING) so nothing can drift.

## API

Full endpoint reference with body examples lives in [docs/API.md](docs/API.md). Auth rides an
httpOnly cookie with an HS256 JWT (7 day expiry, algorithm pinned). Admin routes need the
ADMIN role, everything else is scoped to the owning user and returns 404 on foreign ids so
resource existence never leaks.

## key decisions

- Supabase Postgres via Prisma. The brief said MongoDB or Supabase, and Supabase is Postgres,
  so we kept the relational model (clients to filings is naturally relational). Auth stays in
  our Express code on purpose: a managed auth service would delete the backend this assignment
  is meant to evaluate.
- Derived filing status instead of a stored column or cron job.
- Hand parsed cookies instead of the cookie-parser dep. One header, one dependency saved.
- Express 5 with zod validate middleware and a single terminal error handler. AppError thrown
  anywhere maps to clean JSON. Register catches the Prisma unique violation directly so the
  check and insert are one atomic step.
- GSTIN validated against the real 15 char structure (state code, PAN, entity code, Z,
  checksum). A compliance product that accepts garbage GSTINs is not credible.
- The agent never talks to the database directly. It calls tools, each tool returns only data
  the signed in user owns, and its answers are rendered read-only. No agent framework, no
  chain: one tool loop with a max depth of 4.
- Vercel deploy via GitHub Actions (`.github/workflows/deploy-frontend.yml`), needs
  VERCEL_TOKEN / VERCEL_ORG_ID / VERCEL_PROJECT_ID repo secrets. CI typechecks the backend and
  builds the frontend on every PR.
- The frontend runs on Next, React, Tailwind, Phosphor icons and GSAP for scroll effects. No
  state library. A 15 line fetch wrapper handles cookies and errors.

## not done yet

- Refresh tokens (rotating cookie would be next), rate limiting (express-rate-limit on auth
  and the agent route), pagination (offset when it hurts), tests beyond typechecks (vitest +
  supertest against the exported app).
- Client portal: clients logging in to see their own filings. The role enum and userId scoping
  are in place, it needs a CLIENT role and a read-only view.
- Recurring filings: GST is monthly, ITR is yearly. A recurrence rule that spawns the next
  period on completion would remove most of the data entry.
- Deployed demo: the workflow is ready, the backend would go on Render since Vercel needs an
  adapter for Express.

## how RAG would fit

When filing documents land in the product, this is the simplest version that works:

1. Documents table: a client uploads a PDF, we store the file and a Documents row per filing.
2. Chunk: split the extracted text into ~500 token chunks on upload.
3. Embed: one embedding per chunk (OpenAI or any embedding API), stored in a pgvector column.
4. Ask: the agent gets one more tool, `search_documents(query)`, which embeds the query and
   returns the top 5 chunks. The model answers from those.

Supabase ships pgvector, so there is no infra change. Everything else in the agent (tool loop,
ownership scoping, JSON shape checks) stays exactly as it is.
