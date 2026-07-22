create table public.service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 80),
  created_at timestamptz not null default now()
);

create unique index service_categories_name_unique_idx
  on public.service_categories (lower(btrim(name)));

insert into public.service_categories (name)
values ('Non classée');

alter table public.services
  add column category_id uuid;

update public.services
set category_id = (
  select id
  from public.service_categories
  where name = 'Non classée'
);

alter table public.services
  alter column category_id set not null,
  add constraint services_category_id_fkey
    foreign key (category_id)
    references public.service_categories(id)
    on delete restrict;

create index services_category_id_idx on public.services(category_id);

alter table public.service_categories enable row level security;

create policy "Public read service_categories" on public.service_categories
  for select
  using (true);

create policy "Admin manage service_categories" on public.service_categories
  for all
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
