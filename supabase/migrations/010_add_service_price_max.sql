alter table public.services
  add column if not exists price_max_cents int4;

alter table public.services
  add constraint services_price_max_cents_check
  check (
    price_max_cents is null
    or price_max_cents >= price_cents
  );
