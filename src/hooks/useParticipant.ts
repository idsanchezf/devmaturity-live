import { useEffect, useState } from 'react';
import { fetchMyParticipant, joinSession } from '@/lib/responses';
import { ParticipantRow, ParticipantRole } from '@/types/domain';

export interface UseParticipantResult {
  participant: ParticipantRow | null;
  loading: boolean;
  error: string | null;
  join: (name: string, role: ParticipantRole) => Promise<ParticipantRow>;
}

/**
 * Identidad del participante actual en una sesión. Se resuelve por
 * (session_id, user_id) contra la base — no necesita localStorage propio
 * porque auth.uid() ya persiste entre recargas vía Supabase Auth.
 */
export function useParticipant(sessionId: string | null, userId: string | null): UseParticipantResult {
  const [participant, setParticipant] = useState<ParticipantRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId || !userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    fetchMyParticipant(sessionId, userId)
      .then((row) => {
        if (!cancelled) setParticipant(row as ParticipantRow | null);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId, userId]);

  const join = async (name: string, role: ParticipantRole) => {
    if (!sessionId || !userId) throw new Error('Sesión no lista todavía.');
    const row = (await joinSession(sessionId, userId, name, role)) as ParticipantRow;
    setParticipant(row);
    return row;
  };

  return { participant, loading, error, join };
}
