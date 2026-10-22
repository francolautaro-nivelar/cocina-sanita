-- Guardado del carrito en curso desde el navegador del visitante.
--
-- Por RLS el visitante anónimo puede INSERT en cart_sessions pero no SELECT
-- (los carritos los lee solo el admin). Postgres necesita poder leer la fila
-- para resolver el ON CONFLICT de un upsert y para el WHERE de un UPDATE, así
-- que desde el cliente anónimo el upsert fallaba con 42501 y un update simple
-- no afectaba ninguna fila: no se guardaba ningún carrito.
--
-- Esta función corre con los permisos de su dueño (security definer), así que
-- puede escribir la fila sin abrir la lectura. Quien conoce un session_id
-- puede actualizar ese carrito —el mismo trato que ya tenía—, pero nadie
-- puede leer los datos de nadie.

create or replace function public.upsert_cart_session(
  p_session_id uuid,
  p_items jsonb default null,
  p_total integer default null,
  p_customer_name text default null,
  p_customer_phone text default null,
  p_delivery_method text default null,
  p_address_ref text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into cart_sessions as cs (
    session_id, items, total, customer_name, customer_phone,
    delivery_method, address_ref, updated_at
  )
  values (
    p_session_id,
    coalesce(p_items, '[]'::jsonb),
    coalesce(p_total, 0),
    p_customer_name,
    p_customer_phone,
    p_delivery_method,
    p_address_ref,
    now()
  )
  on conflict (session_id) do update set
    items           = coalesce(p_items, cs.items),
    total           = coalesce(p_total, cs.total),
    customer_name   = coalesce(p_customer_name, cs.customer_name),
    customer_phone  = coalesce(p_customer_phone, cs.customer_phone),
    delivery_method = coalesce(p_delivery_method, cs.delivery_method),
    address_ref     = coalesce(p_address_ref, cs.address_ref),
    updated_at      = now()
  -- un carrito ya convertido en pedido no vuelve a contarse como abierto
  where cs.status = 'open';
end;
$$;

revoke all on function public.upsert_cart_session(uuid, jsonb, integer, text, text, text, text) from public;
grant execute on function public.upsert_cart_session(uuid, jsonb, integer, text, text, text, text) to anon, authenticated;

-- Al confirmar el pedido hay que sacar ese carrito de "abandonados". Es un
-- UPDATE desde el visitante anónimo, así que arrastra el mismo problema y
-- necesita su propia función.
create or replace function public.mark_cart_session_ordered(
  p_session_id uuid,
  p_order_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update cart_sessions
  set status = 'ordered', order_id = p_order_id, updated_at = now()
  where session_id = p_session_id;
end;
$$;

revoke all on function public.mark_cart_session_ordered(uuid, uuid) from public;
grant execute on function public.mark_cart_session_ordered(uuid, uuid) to anon, authenticated;
