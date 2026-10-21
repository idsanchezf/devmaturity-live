import { supabase } from './supabase';

const MODERATOR_UNLOCK_KEY = 'dml_moderator_unlocked';

/** Indica si esta pestaña ya pasó la passphrase disuasoria del panel de moderador. */
export function isModeratorUnlocked(): boolean {
  return sessionStorage.getItem(MODERATOR_UNLOCK_KEY) === '1';
}

export function setModeratorUnlocked(): void {
  sessionStorage.setItem(MODERATOR_UNLOCK_KEY, '1');
}

let inflight: Promise<string> | null = null;

/**
 * Garantiza una identidad anónima estable (auth.uid()) para este navegador.
 * Es la base de todas las políticas RLS: nunca confiamos en un `user_id`
 * que el cliente mande "a mano", siempre usamos el uid firmado por Supabase.
 *
 * Requiere habilitar Authentication -> Anonymous Sign-Ins en el proyecto.
 */
export async function ensureAnonUserId(): Promise<string> {
  if (inflight) return inflight;

  inflight = (async () => {
    const { data: existing, error: getError } = await supabase.auth.getSession();
    if (getError) throw getError;

    if (existing.session?.user?.id) {
      return existing.session.user.id;
    }

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      throw new Error(
        `No se pudo crear una sesión anónima en Supabase: ${error.message}. ` +
          'Verifica que "Anonymous Sign-Ins" esté habilitado en Authentication > Providers.',
      );
    }
    if (!data.user) {
      throw new Error('Supabase no devolvió un usuario anónimo válido.');
    }
    return data.user.id;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}
