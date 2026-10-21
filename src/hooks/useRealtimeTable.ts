import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

type TableName = 'participants' | 'icebreaker_responses' | 'assessment_responses';

interface RowWithId {
  id: string;
}

/**
 * Suscripción en tiempo real genérica y segura contra fugas de memoria:
 *  - Un único canal por (tabla, sessionId).
 *  - Filtra en servidor por session_id (no trae filas de otras sesiones).
 *  - Se desuscribe explícitamente (`removeChannel`) en el cleanup del efecto
 *    y cuando cambia `sessionId`, nunca acumula canales fantasma.
 *  - Reconcilia por `id` (INSERT/UPDATE) y limpia (DELETE) sin duplicados.
 */
export function useRealtimeTable<T extends RowWithId>(table: TableName, sessionId: string | null) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const upsertRow = useCallback((row: T) => {
    setRows((prev) => {
      const idx = prev.findIndex((r) => r.id === row.id);
      if (idx === -1) return [...prev, row];
      const next = [...prev];
      next[idx] = row;
      return next;
    });
  }, []);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setRows([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase
      .from(table)
      .select('*')
      .eq('session_id', sessionId)
      .then(({ data, error: fetchError }) => {
        if (cancelled) return;
        if (fetchError) {
          setError(fetchError.message);
        } else {
          setRows((data ?? []) as T[]);
        }
        setLoading(false);
      });

    const channel = supabase
      .channel(`${table}-session-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table, filter: `session_id=eq.${sessionId}` },
        (payload) => upsertRow(payload.new as T),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table, filter: `session_id=eq.${sessionId}` },
        (payload) => upsertRow(payload.new as T),
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table, filter: `session_id=eq.${sessionId}` },
        (payload) => removeRow((payload.old as T).id),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, sessionId]);

  return { rows, loading, error };
}
