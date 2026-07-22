---
name: architecture
description: Use this skill when creating new files, new folders, new features, or when deciding where to place a piece of code. It defines the folder structure and the responsibility of each layer in the application.
---

# Architecture — Hair Salon Booking App

## Folder Structure
```
/
├── app/                        # Next.js App Router — routes only
│   ├── (public)/               # Public routes (no auth required)
│   │   ├── page.tsx            # Landing / booking page
│   │   └── booking/
│   │       └── [date]/
│   │           └── page.tsx    # Slot selection for a given date
│   ├── (dashboard)/            # Protected routes (hairdresser only)
│   │   ├── layout.tsx          # Auth guard
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Dashboard overview
│   │   ├── agenda/
│   │   │   └── page.tsx        # Full calendar agenda view
│   │   ├── services/
│   │   │   └── page.tsx        # Manage services
│   │   └── schedule/
│   │       └── page.tsx        # Manage availability & days off
│   └── api/                    # API routes (webhooks, server actions)
│
├── components/                 # Reusable, stateless UI components
│   ├── ui/                     # Primitives: Button, Input, Modal...
│   └── layout/                 # Header, Footer, Sidebar...
│
├── features/                   # Business logic, one folder per domain
│   ├── booking/
│   │   ├── actions.ts          # Server Actions
│   │   ├── queries.ts          # Supabase read queries
│   │   ├── mutations.ts        # Supabase write mutations
│   │   └── utils.ts            # Pure functions (slot calculation etc.)
│   ├── dashboard/
│   │   ├── queries.ts          # Aggregated dashboard read model
│   │   └── utils.ts            # Dashboard formatting and mapping helpers
│   ├── services/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   ├── service-categories/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   ├── mutations.ts
│   │   └── utils.ts
│   ├── schedule/
│   │   ├── actions.ts
│   │   ├── queries.ts
│   │   └── mutations.ts
│   └── notifications/
│       └── email.ts            # Resend email functions (Confirmations, Reminders, Cancellations)
│
├── hooks/                      # Custom React hooks
│   ├── use-available-slots.ts
│   └── use-bookings.ts
│
├── lib/                        # Clients and shared utilities
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   ├── service-role.ts     # Server-only trusted client for internal token flows
│   │   └── types.ts            # Generated Supabase types (auto-generated)
│   └── resend/
│       └── client.ts           # Resend client instance
│
└── types/                      # Shared TypeScript types
    ├── booking.ts
    ├── service.ts
    └── schedule.ts
```

## Layer Responsibilities

### `app/` — Routing only
- Import components and features
- No business logic
- No direct Supabase calls

### `components/` — Pure UI
- No Supabase calls
- No business logic
- Receive data via props only

### `features/` — Business logic
- All Supabase interactions go here
- `queries.ts` → read-only operations
- `mutations.ts` → write operations
- `utils.ts` → pure functions, no side effects (testable)
- `actions.ts` → Server Actions that orchestrate queries + mutations + notifications

### `hooks/` — Client-side state
- Wrap feature queries for React components
- Use `SWR` or `useState` + `useEffect`

### `lib/` — Infrastructure
- Supabase client initialization
- Resend client initialization
- No business logic
- `supabase/service-role.ts` must stay server-only and must only be used by feature-layer code for trusted internal operations that cannot rely on public RLS, such as booking availability checks or token-verified booking confirmation/cancellation.
