---
name: project-context
description: Use this skill for every task in this project. It provides the tech stack, constraints, naming conventions, and non-negotiable rules that must be respected at all times when writing or modifying code.
---

# Project Context — Hair Salon Booking App

## Stack
- **Framework**: Next.js 14+ with App Router
- **Database & Auth**: Supabase (PostgreSQL + Supabase Auth)
- **Email**: Resend (transactional emails only — no SMS)
- **Deployment**: Vercel
- **Language**: TypeScript (strict mode — `strict: true` in tsconfig)
- **Fonts**: Self-hosted with `next/font/local` from `app/fonts/` to keep builds independent from Google Fonts network fetches.

## Project Description
Single-provider hair salon booking application.
- One hairdresser, no employees
- Clients book appointments online
- The hairdresser manages her schedule via a private dashboard
- Services are organized into admin-managed categories displayed as public catalog filters

## Non-Negotiable Rules
- **No `any` type** — ever. Use `unknown` and narrow if needed.
- **No inline styles** — use Tailwind CSS utility classes only.
- **No raw SQL** — use Supabase client and generated types only.
- **No business logic in Server Actions or API routes** — delegate to `/features`.
- **No component over 150 lines** — split into sub-components.
- **One responsibility per file** — a file exports one primary thing.
- **No `next/font/google`** — use local font files through `next/font/local` to avoid build-time network failures.

## Naming Conventions
| Item | Convention | Example |
|---|---|---|
| Files & folders | kebab-case | `booking-card.tsx` |
| React components | PascalCase | `BookingCard` |
| Functions & hooks | camelCase | `useAvailableSlots` |
| Types & interfaces | PascalCase | `BookingSlot` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_BOOKING_DAYS` |
| Supabase tables | snake_case | `booking_slots` |

## Environment Variables (never hardcode)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
HAIRDRESSER_NOTIFICATION_EMAIL
CRON_SECRET
```
