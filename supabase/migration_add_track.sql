-- =============================================================================
-- DevMaturity Live — Migración: soporte multi-track (DevOps + Agilidad)
-- =============================================================================
-- MIGRACIÓN NO DESTRUCTIVA: solo añade columnas y amplía constraints.
-- Las sesiones y respuestas existentes conservan sus datos intactos.
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Columna `track` en sessions
--    DEFAULT 'devops' → todas las sesiones previas quedan asignadas a DevOps.
-- -----------------------------------------------------------------------------
alter table public.sessions
  add column if not exists track text not null default 'devops'
    check (track in ('devops', 'agile'));

-- -----------------------------------------------------------------------------
-- 2. Columna `track` en icebreaker_responses
--    DEFAULT 'devops' → votos existentes pertenecen al track DevOps.
-- -----------------------------------------------------------------------------
alter table public.icebreaker_responses
  add column if not exists track text not null default 'devops'
    check (track in ('devops', 'agile'));

-- El constraint UNIQUE original era (session_id, user_id), lo que impedía
-- que un participante votara en ambos tracks de la misma sesión.
-- Lo reemplazamos por (session_id, user_id, track).
alter table public.icebreaker_responses
  drop constraint if exists icebreaker_responses_session_id_user_id_key;

alter table public.icebreaker_responses
  add constraint icebreaker_responses_session_user_track_key
    unique (session_id, user_id, track);

-- -----------------------------------------------------------------------------
-- 3. Columna `track` en assessment_responses
--    DEFAULT 'devops' → respuestas existentes pertenecen al track DevOps.
-- -----------------------------------------------------------------------------
alter table public.assessment_responses
  add column if not exists track text not null default 'devops'
    check (track in ('devops', 'agile'));

-- El constraint UNIQUE original era (session_id, user_id, practice_key).
-- Añadimos `track` para permitir la misma practice_key en tracks distintos
-- (aunque en la práctica cada track tiene practice_keys disjuntas).
alter table public.assessment_responses
  drop constraint if exists assessment_responses_session_id_user_id_practice_key_key;

alter table public.assessment_responses
  add constraint assessment_responses_session_user_practice_track_key
    unique (session_id, user_id, practice_key, track);

-- Ampliar el check de practice_key para incluir las 8 dimensiones de Agilidad
alter table public.assessment_responses
  drop constraint if exists assessment_responses_practice_key_check;

alter table public.assessment_responses
  add constraint assessment_responses_practice_key_check
    check (practice_key in (
      -- DevOps
      'version_control', 'ci_cd', 'automated_testing', 'devops_culture',
      'devsecops', 'code_quality', 'clear_requirements', 'dora_metrics',
      -- Agile
      'psychological_safety', 'value_focus', 'collaboration', 'change_response',
      'autonomy', 'feedback_cycles', 'experimentation', 'continuous_improvement'
    ));

-- -----------------------------------------------------------------------------
-- 4. Índices de apoyo para filtrados por track
-- -----------------------------------------------------------------------------
create index if not exists idx_icebreaker_session_track
  on public.icebreaker_responses(session_id, track);

create index if not exists idx_assessment_session_track
  on public.assessment_responses(session_id, track);

-- -----------------------------------------------------------------------------
-- 5. Publicación Realtime
--    Las tablas ya estaban publicadas; no es necesario repetir el ADD TABLE.
--    Solo nos aseguramos de que sessions siga publicada (idempotente).
-- -----------------------------------------------------------------------------
-- alter publication supabase_realtime add table public.sessions;  -- ya existe

-- Fin de la migración.
