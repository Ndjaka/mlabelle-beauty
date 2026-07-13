-- Track client reminder emails to avoid duplicate sends from scheduled jobs.

alter table public.bookings
  add column if not exists client_day_before_reminder_sent_at timestamptz,
  add column if not exists client_two_hours_reminder_sent_at timestamptz;

create index if not exists bookings_day_before_reminder_due_idx
  on public.bookings(starts_at)
  where status = 'confirmed'
    and client_day_before_reminder_sent_at is null;

create index if not exists bookings_two_hours_reminder_due_idx
  on public.bookings(starts_at)
  where status = 'confirmed'
    and client_two_hours_reminder_sent_at is null;
