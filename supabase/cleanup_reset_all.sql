-- =============================================================================
-- DevMaturity Live — Script de limpieza total de la base de datos
-- =============================================================================
-- ADVERTENCIA: Este script elimina TODOS los datos de la aplicación.
-- Las tablas y políticas RLS se conservan intactas.
-- Las secuencias de IDs se reinician desde cero.
--
-- Instrucciones:
--   Supabase Dashboard → SQL Editor → New query → pegar y ejecutar.
--
-- Alcance:
--   • assessment_responses  (borrado por CASCADE desde sessions)
--   • icebreaker_responses  (borrado por CASCADE desde sessions)
--   • participants          (borrado por CASCADE desde sessions)
--   • sessions              (borrado directo con TRUNCATE … CASCADE)
--
-- Lo que NO se toca:
--   • Estructura de tablas, columnas y constraints
--   • Políticas RLS
--   • Publicación Realtime
--   • Usuarios anónimos en auth.users (Supabase Auth — fuera de alcance)
-- =============================================================================

-- Desactivar RLS temporalmente para esta conexión (sesión de SQL Editor)
-- para evitar que la política "sessions_update_own" bloquee el TRUNCATE.
set local role postgres;

-- TRUNCATE con CASCADE elimina en orden correcto respetando las FKs.
-- RESTART IDENTITY reinicia los contadores de secuencia (si los hubiera).
truncate table
  public.assessment_responses,
  public.icebreaker_responses,
  public.participants,
  public.sessions
restart identity cascade;

-- Confirmar resultado
select
  'sessions'              as tabla, count(*) as filas from public.sessions
union all
select 'participants',              count(*) from public.participants
union all
select 'icebreaker_responses',      count(*) from public.icebreaker_responses
union all
select 'assessment_responses',      count(*) from public.assessment_responses;

-- Resultado esperado: todas las tablas con 0 filas.
