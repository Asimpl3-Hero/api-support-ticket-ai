-- ============================================
-- Tabla: tickets
-- Descripción: Almacena tickets de soporte al cliente
-- para ser procesados por el servicio de IA
-- ============================================

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),        -- Identificador único del ticket
  created_at timestamp with time zone default now(),    -- Fecha de creación
  description text not null,                            -- Texto del ticket (requerido)
  category text,                                        -- Categoría detectada por IA (facturación, soporte técnico, ventas, etc.)
  sentiment text,                                       -- Sentimiento detectado (positivo, negativo, neutro)
  processed boolean default false                       -- Indica si el ticket ya fue analizado
);


-- Habilitar Row Level Security para control de acceso
alter table public.tickets enable row level security;


-- Política: Permitir lectura pública de todos los tickets
-- Nota: En producción, considera restringir según autenticación
create policy "ticketpolicy"
on public.tickets
for select
to public
using (true);
