import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Falla rápido y visible en vez de dejar al cliente de Supabase lanzar
  // errores de red crípticos más adelante.
  console.error(
    '[DevMaturity Live] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Copia .env.example a .env.local y configúralas.',
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'devmaturity-live-auth',
  },
  realtime: {
    params: {
      // Límite defensivo de eventos/segundo por canal: evita que un pico de
      // escrituras (p.ej. 60 personas votando al mismo segundo) sature al
      // cliente del moderador o agote la cuota del proyecto Supabase.
      eventsPerSecond: 8,
    },
  },
});
