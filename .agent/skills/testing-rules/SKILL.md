---
name: testing-rules
description: Use this skill when writing, running, or modifying tests. It defines exactly what must be tested, what must not be tested, the testing framework to use, and the patterns to follow.
---

# Testing Rules — Hair Salon Booking App

## Framework
- **Vitest** — fast, native TypeScript, compatible with Next.js
- Test files: `*.test.ts` or `*.test.tsx`
- Location: colocate test files next to the source file they test

```
features/booking/utils.ts
features/booking/utils.test.ts   ← here
```

---

## What TO Test

Only pure functions in `features/*/utils.ts`. These are the critical, bug-prone functions that justify unit tests.

### Priority 1 — Slot availability (most critical)
```ts
// features/booking/utils.ts
getAvailableSlots(date, scheduleRules, existingBookings, serviceDuration)
```
Must test:
- Returns empty array on a day off
- Returns empty array outside opening hours
- Excludes slots that overlap existing bookings
- Respects buffer time between appointments
- Handles edge case: last slot fits exactly before closing
- Handles edge case: slot starts exactly when another ends

### Priority 2 — Duration & time helpers
```ts
computeEndTime(startsAt: Date, durationMinutes: number): Date
isSlotOverlapping(slotA: TimeRange, slotB: TimeRange): boolean
formatTimeSlot(date: Date): string  // "09:30"
```

### Priority 3 — Price formatting
```ts
formatPrice(cents: number): string  // 5000 → "50,00 €"
```

---

## What NOT to Test

- React components (UI logic changes too frequently)
- Server Actions (integration concern, not unit)
- Supabase queries/mutations (mock hell, low ROI)
- Next.js routing

---

## Test Patterns

### Arrange / Act / Assert
```ts
import { describe, it, expect } from 'vitest'
import { getAvailableSlots } from './utils'

describe('getAvailableSlots', () => {
  it('returns empty array when date is a day off', () => {
    // Arrange
    const date = new Date('2025-08-15') // day off
    const daysOff = [{ date: '2025-08-15' }]

    // Act
    const result = getAvailableSlots(date, defaultSchedule, [], 60, daysOff)

    // Assert
    expect(result).toEqual([])
  })
})
```

### No magic values — use named constants in tests
```ts
// ✅
const SIXTY_MINUTES = 60
const OPENING_TIME = '09:00'

// ❌
getAvailableSlots(date, schedule, [], 60)
```

---

## Running Tests
```bash
# Run all tests
npx vitest run

# Watch mode during development
npx vitest

# Coverage report
npx vitest run --coverage
```
