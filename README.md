# DevMaturity Live

SPA estática (React + Vite + Tailwind) para evaluar en vivo la madurez técnica
de un equipo, estilo Mentimeter: la audiencia se conecta por QR, responde un
Ice Breaker y una autoevaluación de 8 prácticas, con resultados individuales
y agregados en tiempo real vía Supabase Realtime.

## Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS + Lucide Icons
- **Routing:** `react-router-dom` con `HashRouter` (cero 404 en GitHub Pages)
- **Backend:** Supabase (PostgreSQL + Auth anónima + Realtime + RLS), sin servidor propio
- **Gráficos:** Recharts (`RadarChart`, `BarChart`)
- **QR:** `qrcode.react`

## Puesta en marcha

### 1. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. **Authentication → Providers → Anonymous Sign-Ins → Enable.** Es obligatorio:
   toda la seguridad (RLS) se apoya en `auth.uid()` de sesiones anónimas, no en
   la Anon Key.
3. **SQL Editor → New query** → pega y ejecuta `supabase/schema.sql` completo.
   Crea tablas, índices, triggers, políticas RLS y habilita Realtime.
4. Copia la **Project URL** y la **anon public key** (Settings → API).

### 2. Frontend local

```bash
cp .env.example .env.local
# edita .env.local con tu URL y Anon Key de Supabase
npm install
npm run dev
```

- Vista participante: `http://localhost:5173/?session=DEV-XXXX`
- Vista presentador: `http://localhost:5173/#/moderator`

### 3. Despliegue a GitHub Pages

1. En GitHub → repo → **Settings → Pages → Source: GitHub Actions**.
2. En **Settings → Secrets and variables → Actions**, crea:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_MODERATOR_PASSPHRASE` (opcional, protege `/#/moderator`)
3. Push a `main`: el workflow `.github/workflows/deploy.yml` construye con el
   `base` correcto (`/<repo>/`) y publica `dist/` automáticamente.

La app usa `HashRouter`, así que **recargar cualquier subruta nunca produce
404** en GitHub Pages (no existen subrutas reales del servidor, todo vive
después del `#`). El único archivo servido es `index.html`.

## Estructura

```
src/
  lib/        cliente Supabase, auth anónima, mutaciones (join/vote/answer)
  hooks/      estado + Realtime (useSession, useRealtimeTable, useParticipant)
  data/       contenido de las 8 prácticas y escala del Ice Breaker
  utils/      agregación (radar grupal, semáforo IA, distribución Ice Breaker)
  components/
    participant/   onboarding, sala de espera, votación, carrusel, radar propio
    moderator/      QR, control de actividad, dashboards agregados
    charts/         wrappers de Recharts
  pages/      ParticipantPage.tsx, ModeratorPage.tsx (orquestan los hooks)
supabase/
  schema.sql  esquema completo + RLS + Realtime (idempotente, re-ejecutable)
```

Ver `REVIEW.md` para la auditoría de seguridad/arquitectura (Fase 2) y los
ajustes aplicados en la versión final (Fase 3).
