create extension if not exists btree_gist;

alter table public.bookings
  add constraint bookings_no_overlapping_active_times
  exclude using gist (
    tstzrange(starts_at, ends_at, '[)') with &&
  )
  where (status in ('pending', 'confirmed'));
