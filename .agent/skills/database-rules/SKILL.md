---
name: database-rules
description: Use this skill when writing any code that interacts with Supabase or the database. It covers the schema, query patterns, type safety, and security rules that must be followed.
---

# Database Rules — Hair Salon Booking App

## Database: Supabase (PostgreSQL)

---

## Schema

### `services`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, default `gen_random_uuid()` |
| `name` | `text` | e.g. "Coupe femme" |
| `duration_minutes` | `int4` | Duration in minutes |
| `price_cents` | `int4` | Price in euro cents (avoid floats) |
| `is_active` | `bool` | Soft delete |
| `created_at` | `timestamptz` | Default `now()` |

### `schedule_rules`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `day_of_week` | `int2` | 0 = Sunday … 6 = Saturday |
| `open_time` | `time` | e.g. `09:00` |
| `close_time` | `time` | e.g. `18:00` |
| `is_active` | `bool` | Whether this day is open |

### `days_off`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `date` | `date` | Specific closed date |
| `reason` | `text` | Optional label |

### `bookings`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key |
| `service_id` | `uuid` | FK → `services.id` |
| `client_name` | `text` | |
| `client_email` | `text` | |
| `client_phone` | `text` | Optional |
| `starts_at` | `timestamptz` | Booking start datetime |
| `ends_at` | `timestamptz` | Computed: starts_at + duration |
| `status` | `text` | `pending` \| `confirmed` \| `cancelled` |
| `cancel_token` | `uuid` | Used in cancellation emails |
| `created_at` | `timestamptz` | Default `now()` |
| `client_day_before_reminder_sent_at` | `timestamptz` | Tracks J-1 client reminder email |
| `client_two_hours_reminder_sent_at` | `timestamptz` | Tracks 2h-before client reminder email |

---

## Query Rules

### Always use generated types
```ts
// ✅ Correct
import type { Database } from '@/lib/supabase/types'
type Booking = Database['public']['Tables']['bookings']['Row']

// ❌ Never
const booking: any = data
```

### Always handle errors explicitly
```ts
// ✅ Correct
const { data, error } = await supabase.from('bookings').select('*')
if (error) throw new Error(error.message)

// ❌ Never
const { data } = await supabase.from('bookings').select('*')
return data
```

### Server vs Client Supabase
```ts
// In Server Components, Server Actions, API routes:
import { createServerClient } from '@/lib/supabase/server'

// In Client Components:
import { createBrowserClient } from '@/lib/supabase/client'
```

### Service role client

`createServiceRoleClient` from `@/lib/supabase/service-role` is server-only and bypasses RLS.
Use it sparingly, only inside `/features`, for trusted internal operations that must not be publicly readable:
- computing slot availability from private booking times
- reading a booking after verifying `booking_id + cancel_token`
- cancelling a booking after verifying `cancel_token`

Never import the service role client into Client Components, public UI components, or broad admin queries that should be protected by RLS.

---

## Security Rules (Row Level Security)

- **`bookings`**: Public INSERT (clients can book). SELECT/UPDATE/DELETE restricted to authenticated user (hairdresser) or matching `cancel_token`.
- **`services`**: Public SELECT. INSERT/UPDATE/DELETE restricted to authenticated user.
- **`schedule_rules`**: Public SELECT. INSERT/UPDATE/DELETE restricted to authenticated user.
- **`days_off`**: Public SELECT. INSERT/UPDATE/DELETE restricted to authenticated user.

> Always enable RLS on every table. Never disable it.

---

## Forbidden Patterns
- No raw SQL via `supabase.rpc()` unless absolutely necessary and documented
- No `.select('*')` in production queries — always specify columns
- No storing prices as floats — always use integer cents
- No storing dates as strings — always use `timestamptz` or `date`
