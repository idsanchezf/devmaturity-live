import { useEffect, useState } from 'react';
import { ensureAnonUserId } from '@/lib/auth';

export interface AnonUserState {
  userId: string | null;
  loading: boolean;
  error: string | null;
}

/** Garantiza y expone el auth.uid() anónimo estable de este navegador. */
export function useAnonUser(): AnonUserState {
  const [state, setState] = useState<AnonUserState>({ userId: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    ensureAnonUserId()
      .then((userId) => {
        if (!cancelled) setState({ userId, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ userId: null, loading: false, error: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
