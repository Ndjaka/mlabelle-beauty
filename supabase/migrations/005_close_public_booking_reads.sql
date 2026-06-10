-- Close broad public access to bookings.
--
-- Public booking flows now go through trusted server actions:
-- - slot availability reads only starts_at / ends_at internally
-- - confirmation requires booking_id + cancel_token
-- - cancellation requires cancel_token
--
-- Keeping these policies open exposes client booking details.
drop policy if exists "Public read own booking by token" on public.bookings;
drop policy if exists "Public cancel by token" on public.bookings;
