-- Restrict private salon management access to Supabase Auth users
-- whose app_metadata.role is explicitly set to "admin".
--
-- The public booking flow stays unchanged here:
-- - clients can still read active services / schedule / days off
-- - clients can still create bookings
-- - existing public booking read/cancel policies are left untouched

-- services
drop policy if exists "Auth write services" on public.services;

create policy "Admin manage services" on public.services
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- schedule_rules
drop policy if exists "Auth write schedule_rules" on public.schedule_rules;

create policy "Admin manage schedule_rules" on public.schedule_rules
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- days_off
drop policy if exists "Auth write days_off" on public.days_off;

create policy "Admin manage days_off" on public.days_off
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- bookings
drop policy if exists "Auth read all bookings" on public.bookings;
drop policy if exists "Auth update bookings" on public.bookings;

create policy "Admin read bookings" on public.bookings
  for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "Admin update bookings" on public.bookings
  for update
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
