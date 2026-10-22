import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { ActivityState, SessionRow, TrackType } from '@/types/domain';
import { generateSessionCode, normalizeSessionCode } from '@/utils/sessionCode';

export interface UseSessionResult {
  session: SessionRow | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
}

/** Carga una sesión por código y se mantiene sincronizada en tiempo real. */
export function useSessionByCode(rawCode: string | null): UseSessionResult {
  const code = rawCode ? normalizeSessionCode(rawCode) : null;
  const [session, setSession] = useState<SessionRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!code) {
      setSession(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setNotFound(false);

    supabase
      .from('sessions')
      .select('*')
      .eq('code', code)
      .maybeSingle()
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError(fetchError.message);
        } else if (!data) {
          setNotFound(true);
        } else {
          setSession(data as SessionRow);
        }
        setLoading(false);
      });

    const channel = supabase
      .channel(`session-watch-${code}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'sessions', filter: `code=eq.${code}` },
        (payload) => {
          setSession(payload.new as SessionRow);
          setNotFound(false);
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [code]);

  return { session, loading, error, notFound };
}

/** Crea una nueva sesión propiedad del moderador autenticado (auth.uid()). */
export async function createSession(moderatorUserId: string): Promise<SessionRow> {
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt < 5) {
    const code = generateSessionCode();
    const { data, error } = await supabase
      .from('sessions')
      .insert({ code, moderator_user_id: moderatorUserId, current_activity: 'waiting', track: 'devops' })
      .select('*')
      .single();

    if (!error && data) return data as SessionRow;

    lastError = error;
    attempt += 1;
  }

  throw new Error(
    `No se pudo crear la sesión tras ${attempt} intentos: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

export async function updateSessionActivity(sessionId: string, activity: ActivityState): Promise<void> {
  const { error } = await supabase.from('sessions').update({ current_activity: activity }).eq('id', sessionId);
  if (error) throw new Error(`No se pudo cambiar la actividad: ${error.message}`);
}

export async function updateSessionTrack(sessionId: string, track: TrackType): Promise<void> {
  const { error } = await supabase.from('sessions').update({ track }).eq('id', sessionId);
  if (error) throw new Error(`No se pudo cambiar el track: ${error.message}`);
}
