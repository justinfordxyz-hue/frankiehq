# Frankie — Virtual FBC Support Platform

> Your FBCs' secret weapon.

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in your keys in .env.local
npm run dev
```

## Environment Variables

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon/public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk → API Keys |
| `CLERK_SECRET_KEY` | Clerk → API Keys |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

## Database

Run `supabase/001_initial_schema.sql` in Supabase SQL Editor to create tables.

## Stack

- **Next.js 15** (App Router)
- **Supabase** (Postgres + auth helpers)
- **Clerk** (user auth)
- **Claude API** (letter generation)
- **Tailwind CSS v4**
- **Vercel** (deploy)
