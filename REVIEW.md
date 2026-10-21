# REVIEW.md — Auditoría Constructor ⇄ Revisor

Documento de trazabilidad de las tres fases pedidas: diseño inicial del
**Constructor**, hallazgos del **Revisor (QA & Architecture)**, y los ajustes
aplicados en el código final de este repositorio.

---

## Fase 1 — Entrega del Constructor (resumen)

- Esquema relacional (`sessions`, `participants`, `icebreaker_responses`,
  `assessment_responses`) con `unique(session_id, user_id[, practice_key])`
  para forzar "una respuesta por actividad" a nivel de base de datos, no solo
  en el cliente.
- RLS basada en **Supabase Anonymous Auth**: cada navegador obtiene un
  `auth.uid()` estable; todas las políticas de escritura exigen
  `auth.uid() = user_id` (participante) o `auth.uid() = moderator_user_id`
  (sesión). La Anon Key solo abre PostgREST, nunca autoriza por sí misma.
- SPA con `HashRouter` + `base` configurable por `VITE_BASE_PATH` para
  GitHub Pages.
- Un hook Realtime genérico (`useRealtimeTable`) reutilizado por las 3 tablas
  de alto volumen, con `removeChannel` en el cleanup de cada efecto.

---

## Fase 2 — Hallazgos del Revisor

### 🔴 Seguridad en cliente estático / Anon Key

1. **Anon Key pública por diseño.** Correcto conceptualmente, pero si las
   políticas RLS tuvieran `using (true)` en escritura, cualquiera con la Key
   (visible en el bundle JS) podría escribir filas arbitrarias.
   → **Verificar** que *todas* las políticas INSERT/UPDATE comparen
   `auth.uid()` contra una columna, nunca `with check (true)`.
2. **`/#/moderator` es una ruta pública del bundle.** Cualquiera que la
   adivine puede abrir el panel. Una passphrase en `VITE_MODERATOR_PASSPHRASE`
   vive igualmente en el bundle (inspeccionable), así que **no es control de
   seguridad real**, solo un filtro social.
   → Dejar explícito que la única autorización dura es RLS
   (`moderator_user_id = auth.uid()`): aunque alguien abra el panel sin la
   passphrase, no podrá *mutar* una sesión que no creó él mismo.
3. **Suplantación de nombre.** Nada evita que un participante escriba un
   nombre duplicado o insulte. Es un trade-off aceptado del "sin login" — se
   documenta, no se bloquea (fuera de alcance de un ice-breaker en vivo).

### 🟠 Enrutamiento estático en GitHub Pages

4. `HashRouter` resuelve el problema de raíz: no hay 404 posible porque no
   existen subrutas de servidor. **Pero** el *query string* `?session=CODE`
   vive **antes** del `#`, y GitHub Pages lo preserva igual al servir
   `index.html` para cualquier ruta — confirmado, no requiere `404.html`
   trampolín (ese truco solo es necesario con `BrowserRouter`).
5. `index.html` referencia `/src/main.tsx` con slash inicial absoluta: Vite
   la reescribe automáticamente al `base` configurado durante `build`, pero
   **solo si `base` está bien seteado antes del build** (lo hace el workflow
   vía `VITE_BASE_PATH=/${{ github.event.repository.name }}/`).

### 🟡 Realtime: fugas de memoria y cuota

6. Riesgo clásico de React 18 **StrictMode**: montar/desmontar/montar en dev
   duplicaba canales si el cleanup no llamaba `supabase.removeChannel`.
   → Resuelto: cada `useEffect` de Realtime devuelve `removeChannel` y usa
   `sessionId`/`table` como única dependencia (sin refs fantasmas).
7. Tener 4 canales distintos (`sessions`, `participants`,
   `icebreaker_responses`, `assessment_responses`) suena costoso, pero el
   cliente JS v2 de Supabase **multiplexa todos los canales sobre un único
   WebSocket** por proyecto — no son 4 conexiones, es 1 conexión con 4
   suscripciones lógicas. El límite real a vigilar es *conexiones
   concurrentes* (una por pestaña de participante + proyector), no canales.
8. `eventsPerSecond: 8` en el cliente amortigua picos de escritura (p.ej. 60
   personas votando en el mismo segundo) sin perder eventos de forma
   silenciosa — se limita el *throughput* de entrega, no la persistencia.
9. El participante **no** necesita Realtime para su propio progreso (ya lo
   escribió él): usar *fetch-once* para `icebreaker_responses` /
   `assessment_responses` propias reduce canales activos a solo el
   imprescindible (`sessions`, para saber cuándo cambia la actividad global).

### 🟢 UX móvil / accesibilidad

10. Selector 1–5 del Ice Breaker y las 3 tarjetas de nivel por práctica usan
    `button` + `active:scale-95`/`98` para feedback táctil inmediato, sin
    depender de `:hover` (irrelevante en touch).
11. El carrusel de 8 prácticas avanza automáticamente tras seleccionar nivel,
    pero conserva navegación manual (anterior/siguiente) para quien quiera
    revisar o corregir antes de llegar a la última — evita que un tap
    accidental sea irreversible.
12. Contraste: fondo `ink-950` + texto `slate-100`/`slate-300` cumple AA para
    texto normal; los chips de "Bloquea IA" usan rojo sobre fondo oscuro con
    icono redundante (`ShieldAlert`), no dependen solo del color.

### 🔵 Edge cases

13. Participante que recarga a mitad del assessment: progreso se recupera
    por `fetchMyAssessmentResponses` (persistido en DB, no en estado local).
14. Moderador que recarga el navegador: `localStorage` guarda el último
    código creado; si no coincide con su `auth.uid()` actual (p.ej. borró
    `localStorage` de Supabase Auth pero no el código), se descarta
    automáticamente y se ofrece crear una sesión nueva en vez de bloquear la
    UI en un estado inconsistente.
15. Práctica no respondida en el radar grupal: `average` con `responses = 0`
    se muestra como `0`, no se infla el promedio ni se divide por cero.
16. Colisión de código de sesión (32⁴ combinaciones, improbable): `createSession`
    reintenta hasta 5 veces generando un código nuevo antes de fallar.

---

## Fase 3 — Resolución aplicada por el Constructor

Todo lo anterior ya está incorporado en el código de este repo (no quedan
TODOs pendientes):

| # Hallazgo | Dónde se resolvió |
|---|---|
| 1 | Todas las políticas en `supabase/schema.sql` comparan `auth.uid()`, ninguna usa `with check (true)` en escritura |
| 2 | `src/components/moderator/ModeratorGate.tsx` + comentario explícito de que la autorización real es RLS |
| 4–5 | `src/App.tsx` (`HashRouter`), `vite.config.ts` (`base`), workflow inyecta `VITE_BASE_PATH` |
| 6 | `src/hooks/useRealtimeTable.ts` y `useSession.ts`: cleanup con `supabase.removeChannel` |
| 7–8 | `src/lib/supabase.ts`: `eventsPerSecond: 8`; un canal por tabla, documentado como multiplexado |
| 9 | `src/pages/ParticipantPage.tsx`: `fetchMyIcebreakerVote`/`fetchMyAssessmentResponses` (fetch-once, sin canal propio) |
| 10–12 | `IcebreakerVote.tsx`, `PracticeCard.tsx`, paleta `tailwind.config.js` |
| 13 | `ParticipantPage.tsx` carga `assessmentResponses` desde DB antes de decidir pantalla |
| 14 | `ModeratorPage.tsx`: efecto que limpia `localStorage` si `!isOwner` |
| 15 | `src/utils/scoring.ts`: `average = responses.length > 0 ? total / length : 0` |
| 16 | `src/hooks/useSession.ts`: `createSession` con retry loop |

### Deuda técnica reconocida (fuera de alcance explícito)

- Sin moderación de contenido en nombres de participantes.
- La passphrase de moderador es disuasoria, no criptográfica — aceptable para
  un taller interno; si se necesita más rigor, migrar a Supabase Auth con
  email/magic link solo para el rol moderador.
