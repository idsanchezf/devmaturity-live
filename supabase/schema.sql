-- =============================================================================
-- DevMaturity Live — Esquema de Base de Datos (Supabase / PostgreSQL)
-- =============================================================================
-- Ejecutar completo en: Supabase Dashboard -> SQL Editor -> New query
--
-- REQUISITO PREVIO (manual, no se puede hacer por SQL):
--   Authentication -> Providers -> Anonymous Sign-Ins -> Enable
--   Esto permite que cada participante y el moderador obtengan un auth.uid()
--   estable sin backend propio. Es la base de todas las políticas RLS de
--   abajo: NUNCA confiamos en datos enviados por el cliente para decidir
--   "quién es quién", solo confiamos en auth.uid() firmado por Supabase.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Tablas
-- -----------------------------------------------------------------------------

create table if not exists public.sessions (
  id                 uuid primary key default gen_random_uuid(),
  code               text not null unique,
  moderator_user_id  uuid not null,
  current_activity   text not null default 'waiting'
                       check (current_activity in ('waiting', 'icebreaker', 'assessment', 'results')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create table if not exists public.participants (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.sessions(id) on delete cascade,
  user_id     uuid not null,
  name        text not null check (char_length(trim(name)) between 1 and 40),
  role        text not null default 'other'
               check (role in ('backend', 'frontend', 'devops', 'qa', 'lead', 'other')),
  created_at  timestamptz not null default now(),
  unique (session_id, user_id)
);

create table if not exists public.icebreaker_responses (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.sessions(id) on delete cascade,
  participant_id  uuid not null references public.participants(id) on delete cascade,
  user_id         uuid not null,
  score           smallint not null check (score between 1 and 5),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (session_id, user_id)
);

create table if not exists public.assessment_responses (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.sessions(id) on delete cascade,
  participant_id  uuid not null references public.participants(id) on delete cascade,
  user_id         uuid not null,
  practice_key    text not null check (practice_key in (
                    'version_control', 'ci_cd', 'automated_testing', 'devops_culture',
                    'devsecops', 'code_quality', 'clear_requirements', 'dora_metrics'
                  )),
  level           smallint not null check (level between 1 and 3),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (session_id, user_id, practice_key)
);

create index if not exists idx_participants_session on public.participants(session_id);
create index if not exists idx_icebreaker_session on public.icebreaker_responses(session_id);
create index if not exists idx_assessment_session on public.assessment_responses(session_id);

-- -----------------------------------------------------------------------------
-- 2. Triggers de updated_at
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_sessions_updated_at on public.sessions;
create trigger trg_sessions_updated_at
  before update on public.sessions
  for each row execute function public.set_updated_at();

drop trigger if exists trg_icebreaker_updated_at on public.icebreaker_responses;
create trigger trg_icebreaker_updated_at
  before update on public.icebreaker_responses
  for each row execute function public.set_updated_at();

drop trigger if exists trg_assessment_updated_at on public.assessment_responses;
create trigger trg_assessment_updated_at
  before update on public.assessment_responses
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 3. Row Level Security
-- -----------------------------------------------------------------------------
-- Modelo de seguridad:
--   - La Anon Key NUNCA es el mecanismo de autorización: solo abre la puerta
--     del protocolo PostgREST. La autorización real vive en auth.uid(),
--     generado por Supabase Auth (anonymous sign-in) y verificado en RLS.
--   - Lectura (SELECT) es pública dentro de una sesión: todos los asistentes
--     y el proyector necesitan ver el agregado en tiempo real.
--   - Escritura (INSERT/UPDATE) siempre exige que auth.uid() coincida con la
--     columna user_id (participante) o moderator_user_id (sesión).
--   - Un participante solo puede escribir su propia fila, nunca la de otro.
--   - "Una respuesta por actividad" se garantiza con UNIQUE(session_id,user_id[,practice_key])
--     + upsert desde el cliente (ON CONFLICT ... DO UPDATE), nunca permite 2 filas.
-- -----------------------------------------------------------------------------

alter table public.sessions enable row level security;
alter table public.participants enable row level security;
alter table public.icebreaker_responses enable row level security;
alter table public.assessment_responses enable row level security;

-- sessions ---------------------------------------------------------------
drop policy if exists "sessions_select_public" on public.sessions;
create policy "sessions_select_public"
  on public.sessions for select
  to anon, authenticated
  using (true);

drop policy if exists "sessions_insert_own" on public.sessions;
create policy "sessions_insert_own"
  on public.sessions for insert
  to anon, authenticated
  with check (auth.uid() = moderator_user_id);

drop policy if exists "sessions_update_own" on public.sessions;
create policy "sessions_update_own"
  on public.sessions for update
  to anon, authenticated
  using (auth.uid() = moderator_user_id)
  with check (auth.uid() = moderator_user_id);

-- participants -------------------------------------------------------------
drop policy if exists "participants_select_public" on public.participants;
create policy "participants_select_public"
  on public.participants for select
  to anon, authenticated
  using (true);

drop policy if exists "participants_insert_self" on public.participants;
create policy "participants_insert_self"
  on public.participants for insert
  to anon, authenticated
  with check (auth.uid() = user_id);

drop policy if exists "participants_update_self" on public.participants;
create policy "participants_update_self"
  on public.participants for update
  to anon, authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- icebreaker_responses -------------------------------------------------------
drop policy if exists "icebreaker_select_public" on public.icebreaker_responses;
create policy "icebreaker_select_public"
  on public.icebreaker_responses for select
  to anon, authenticated
  using (true);

drop policy if exists "icebreaker_insert_self" on public.icebreaker_responses;
create policy "icebreaker_insert_self"
  on public.icebreaker_responses for insert
  to anon, authenticated
  with check (auth.uid() = user_id);

drop policy if exists "icebreaker_update_self" on public.icebreaker_responses;
create policy "icebreaker_update_self"
  on public.icebreaker_responses for update
  to anon, authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- assessment_responses --------------------------------------------------------
drop policy if exists "assessment_select_public" on public.assessment_responses;
create policy "assessment_select_public"
  on public.assessment_responses for select
  to anon, authenticated
  using (true);

drop policy if exists "assessment_insert_self" on public.assessment_responses;
create policy "assessment_insert_self"
  on public.assessment_responses for insert
  to anon, authenticated
  with check (auth.uid() = user_id);

drop policy if exists "assessment_update_self" on public.assessment_responses;
create policy "assessment_update_self"
  on public.assessment_responses for update
  to anon, authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 4. Realtime
-- -----------------------------------------------------------------------------
-- Habilita eventos INSERT/UPDATE/DELETE por WebSocket para las tablas que
-- alimentan los dashboards en vivo del moderador y la pantalla de espera
-- del participante.
-- -----------------------------------------------------------------------------

alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.participants;
alter publication supabase_realtime add table public.icebreaker_responses;
alter publication supabase_realtime add table public.assessment_responses;

-- Fin del script.
