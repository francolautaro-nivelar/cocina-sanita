-- Cocina Sanita — datos iniciales
-- Correr DESPUÉS de 0001_init.sql, en el SQL editor de Supabase.
-- Carga las categorías y productos de "Lista de precios.md". Los ítems marcados
-- "SIN STOCK" en la lista original quedan con price = null e in_stock = false.
-- Vegetales, Mix Vegetales y Frutos secos y Granolas quedan creadas sin productos
-- todavía (se cargan después desde el panel /admin).

-- =========================
-- Categorías
-- =========================

insert into categories (name, slug, sort_order, active) values
  ('Frutas', 'frutas', 1, true),
  ('Pulpas', 'pulpas', 2, true),
  ('Mix Frutales', 'mix-frutales', 3, true),
  ('Vegetales', 'vegetales', 4, true),
  ('Mix Vegetales', 'mix-vegetales', 5, true),
  ('Frutos Secos y Granolas', 'frutos-secos-y-granolas', 6, true)
on conflict (slug) do nothing;

-- =========================
-- Frutas
-- =========================

insert into products (category_id, name, slug, price, unit_label, in_stock, sort_order)
select id, v.name, v.slug, v.price, v.unit_label, v.in_stock, v.sort_order
from categories, (values
  ('Ananá en trozos',    'anana-en-trozos',         12500, 'x 1kg',   true, 1),
  ('Arándano',           'arandano',                13900, 'x 1kg',   true, 2),
  ('Cerezas sin carozo', 'cerezas-sin-carozo',       13800, 'x 1kg',   true, 3),
  ('Durazno en gajos',   'durazno-en-gajos',          9100, 'x 1kg',   true, 4),
  ('Frambuesa entera',   'frambuesa-entera-500g',    12800, 'x 1/2kg', true, 5),
  ('Frambuesa entera',   'frambuesa-entera-1kg',     25600, 'x 1kg',   true, 6),
  ('Frutilla',           'frutilla',                  8500, 'x 1kg',   true, 7),
  ('Mango en cubo',      'mango-en-cubo',             10500, 'x 1kg',   true, 8),
  ('Mora',               'mora-500g',                 6500, 'x 1/2kg', true, 9),
  ('Mora',               'mora-1kg',                  12500, 'x 1kg',   true, 10)
) as v(name, slug, price, unit_label, in_stock, sort_order)
where categories.slug = 'frutas'
on conflict (slug) do nothing;

-- =========================
-- Pulpas
-- =========================

insert into products (category_id, name, slug, price, unit_label, in_stock, sort_order)
select id, v.name, v.slug, v.price, v.unit_label, v.in_stock, v.sort_order
from categories, (values
  ('Açaí',                   'acai',                   20300, 'x 1kg',   true, 1),
  ('Frutilla',                'pulpa-frutilla',          6000, 'x 1kg',   true, 2),
  ('Guanábana',                'guanabana-500g',          null::integer, 'x 1/2kg', false, 3),
  ('Guayaba',                 'guayaba',                12900, 'x 1kg',   true, 4),
  ('Lima',                    'lima',                    9900, 'x 1kg',   true, 5),
  ('Limón',                   'limon',                   7500, 'x 1kg',   true, 6),
  ('Lúcuma',                  'lucuma',                  null::integer, 'x 1kg',   false, 7),
  ('Mango',                   'pulpa-mango',             9900, 'x 1kg',   true, 8),
  ('Maracuyá c/semillas',     'maracuya-con-semillas',  13500, 'x 1kg',   true, 9),
  ('Maracuyá s/semillas',     'maracuya-sin-semillas',  14500, 'x 1kg',   true, 10),
  ('Palta en cubos',          'palta-en-cubos',         17900, 'x 1kg',   true, 11),
  ('Palta en mitades',        'palta-en-mitades',        9900, 'x 1/2kg', true, 12)
) as v(name, slug, price, unit_label, in_stock, sort_order)
where categories.slug = 'pulpas'
on conflict (slug) do nothing;

-- =========================
-- Mix Frutales (todos x 1kg)
-- =========================

insert into products (category_id, name, slug, price, unit_label, in_stock, sort_order)
select id, v.name, v.slug, v.price, 'x 1kg', true, v.sort_order
from categories, (values
  ('Frutos rojos (frutilla, mora, arándano, frambuesa)',  'mix-frutos-rojos',       14000, 1),
  ('Frutos del bosque (mora, arándano, frambuesa)',       'mix-frutos-del-bosque',  15500, 2),
  ('Frutos tropicales (frutilla, ananá, durazno, mango)', 'mix-frutos-tropicales',  13500, 3),
  ('Frutos patagónicos (frutilla, mora, arándano)',       'mix-frutos-patagonicos', 13000, 4),
  ('Frutos trío Gold (ananá, mango, durazno)',            'mix-frutos-trio-gold',   13500, 5),
  ('Frutos trío (frutilla, arándano, frambuesa)',         'mix-frutos-trio',        13900, 6),
  ('Frutos dúo (frutilla, ananá)',                        'mix-frutos-duo-anana',   12500, 7),
  ('Frutos dúo (frutilla, arándano)',                     'mix-frutos-duo-arandano',12900, 8),
  ('Frutos dúo (frutilla, frambuesa)',                    'mix-frutos-duo-frambuesa',15500, 9)
) as v(name, slug, price, sort_order)
where categories.slug = 'mix-frutales'
on conflict (slug) do nothing;
