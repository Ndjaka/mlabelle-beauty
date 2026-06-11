alter table public.services
  add column if not exists image_url text;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'service-images',
  'service-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read service images" on storage.objects;
create policy "Public read service images" on storage.objects
  for select
  using (bucket_id = 'service-images');

drop policy if exists "Admin upload service images" on storage.objects;
create policy "Admin upload service images" on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'service-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admin update service images" on storage.objects;
create policy "Admin update service images" on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'service-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    bucket_id = 'service-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admin delete service images" on storage.objects;
create policy "Admin delete service images" on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'service-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
