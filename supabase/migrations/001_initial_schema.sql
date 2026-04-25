-- Extensions
create extension if not exists "uuid-ossp";

-- TABLE : services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_minutes int4 not null check (duration_minutes > 0),
  price_cents int4 not null check (price_cents >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- TABLE : schedule_rules
create table public.schedule_rules (
  id uuid primary key default gen_random_uuid(),
  day_of_week int2 not null check (day_of_week between 0 and 6),
  open_time time not null,
  close_time time not null,
  is_active boolean not null default true,
  constraint check_times check (close_time > open_time),
  constraint unique_day unique (day_of_week)
);

-- TABLE : days_off
create table public.days_off (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  reason text,
  created_at timestamptz not null default now()
);

-- TABLE : bookings
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id),
  client_name text not null,
  client_email text not null,
  client_phone text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  cancel_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  constraint check_times check (ends_at > starts_at)
);

-- INDEX pour les performances
create index bookings_starts_at_idx on public.bookings(starts_at);
create index bookings_status_idx on public.bookings(status);
create index bookings_cancel_token_idx on public.bookings(cancel_token);

-- ROW LEVEL SECURITY
alter table public.services enable row level security;
alter table public.schedule_rules enable row level security;
alter table public.days_off enable row level security;
alter table public.bookings enable row level security;

-- POLICIES : services
create policy "Public read services" on public.services
  for select using (true);

create policy "Auth write services" on public.services
  for all using (auth.role() = 'authenticated');

-- POLICIES : schedule_rules
create policy "Public read schedule_rules" on public.schedule_rules
  for select using (true);

create policy "Auth write schedule_rules" on public.schedule_rules
  for all using (auth.role() = 'authenticated');

-- POLICIES : days_off
create policy "Public read days_off" on public.days_off
  for select using (true);

create policy "Auth write days_off" on public.days_off
  for all using (auth.role() = 'authenticated');

-- POLICIES : bookings
create policy "Public insert bookings" on public.bookings
  for insert with check (true);

create policy "Public read own booking by token" on public.bookings
  for select using (true);

create policy "Auth read all bookings" on public.bookings
  for select using (auth.role() = 'authenticated');

create policy "Auth update bookings" on public.bookings
  for update using (auth.role() = 'authenticated');

create policy "Public cancel by token" on public.bookings
  for update using (cancel_token = (current_setting('request.jwt.claims', true)::json->>'cancel_token')::uuid);

-- DONNÉES INITIALES : horaires par défaut (Lun-Sam, 9h-18h)
insert into public.schedule_rules (day_of_week, open_time, close_time, is_active) values
  (1, '09:00', '18:00', true),  -- Lundi
  (2, '09:00', '18:00', true),  -- Mardi
  (3, '09:00', '18:00', true),  -- Mercredi
  (4, '09:00', '18:00', true),  -- Jeudi
  (5, '09:00', '18:00', true),  -- Vendredi
  (6, '09:00', '17:00', true),  -- Samedi
  (0, '09:00', '18:00', false); -- Dimanche (fermé)

-- DONNÉES INITIALES : services exemples
insert into public.services (name, duration_minutes, price_cents, is_active) values
  ('Coupe femme', 60, 4500, true),
  ('Coupe homme', 30, 2500, true),
  ('Coloration', 120, 8000, true),
  ('Brushing', 45, 3500, true),
  ('Mèches', 150, 10000, true);
