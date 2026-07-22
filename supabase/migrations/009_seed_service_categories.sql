insert into public.service_categories (name)
values
  ('Braids'),
  ('Tissage'),
  ('Vanilles'),
  ('Barrels twist'),
  ('Coloration'),
  ('Extension de cil'),
  ('Soin visage'),
  ('Beauté des mains'),
  ('Beauté des pieds'),
  ('Fulani'),
  ('Nattes collées'),
  ('Flat twist'),
  ('Crochet braids'),
  ('Départ locks')
on conflict ((lower(btrim(name)))) do nothing;
