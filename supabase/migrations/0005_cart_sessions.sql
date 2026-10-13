-- Carritos abandonados: guarda el carrito de cada visitante a medida que lo
-- arma (no solo al confirmar el pedido), más nombre/celular si llega a
-- escribirlos en el checkout aunque no confirme. session_id lo genera y
-- guarda el propio navegador (como una cookie de sesión) — quien lo conoce
-- puede actualizar ese carrito, nadie más.

create table if not exists cart_sessions (
  session_id uuid primary key,
  items jsonb not null default '[]'::jsonb,
  total integer not null default 0,
  customer_name text,
  customer_phone text,
  delivery_method text check (delivery_method in ('retiro', 'envio')),
  address_ref text,
  status text not null default 'open' check (status in ('open', 'ordered')),
  order_id uuid references orders(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cart_sessions_updated_at_idx on cart_sessions(updated_at);
create index if not exists cart_sessions_status_idx on cart_sessions(status);

alter table cart_sessions enable row level security;

drop policy if exists "public insert cart_sessions" on cart_sessions;
create policy "public insert cart_sessions" on cart_sessions
  for insert with check (true);

drop policy if exists "public update cart_sessions" on cart_sessions;
create policy "public update cart_sessions" on cart_sessions
  for update using (true) with check (true);

drop policy if exists "admin read cart_sessions" on cart_sessions;
create policy "admin read cart_sessions" on cart_sessions
  for select using (auth.role() = 'authenticated');

drop policy if exists "admin delete cart_sessions" on cart_sessions;
create policy "admin delete cart_sessions" on cart_sessions
  for delete using (auth.role() = 'authenticated');
