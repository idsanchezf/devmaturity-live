import { useCallback, useEffect, useState } from 'react';
import { useAnonUser } from '@/hooks/useAnonUser';
import { useSessionByCode, createSession, updateSessionActivity, updateSessionTrack } from '@/hooks/useSession';
import { useRealtimeTable } from '@/hooks/useRealtimeTable';
import { ModeratorGate } from '@/components/moderator/ModeratorGate';
import { isModeratorUnlocked } from '@/lib/auth';
import { CreateSessionScreen } from '@/components/moderator/CreateSessionScreen';
import { ModeratorDashboard } from '@/components/moderator/ModeratorDashboard';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { ActivityState, ParticipantRow, IcebreakerResponseRow, AssessmentResponseRow, TrackType } from '@/types/domain';

const LAST_CODE_KEY = 'dml_moderator_last_code';

export function ModeratorPage() {
  const [unlocked, setUnlocked] = useState(isModeratorUnlocked());
  const [code, setCode] = useState<string | null>(() => localStorage.getItem(LAST_CODE_KEY));
  const [creating, setCreating] = useState(false);

  const { userId, loading: authLoading, error: authError } = useAnonUser();
  const { session, loading: sessionLoading, notFound } = useSessionByCode(code);

  const isOwner = !!session && !!userId && session.moderator_user_id === userId;
  const ownedSessionId = isOwner ? session!.id : null;

  const { rows: participants } = useRealtimeTable<ParticipantRow>('participants', ownedSessionId);
  const { rows: icebreakerResponses } = useRealtimeTable<IcebreakerResponseRow>(
    'icebreaker_responses',
    ownedSessionId,
  );
  const { rows: assessmentResponses } = useRealtimeTable<AssessmentResponseRow>(
    'assessment_responses',
    ownedSessionId,
  );

  useEffect(() => {
    if (!authLoading && !sessionLoading && code && (notFound || (session && !isOwner))) {
      localStorage.removeItem(LAST_CODE_KEY);
      setCode(null);
    }
  }, [authLoading, sessionLoading, code, notFound, session, isOwner]);

  const handleCreate = useCallback(async () => {
    if (!userId) throw new Error('Identidad anónima no lista todavía, intenta de nuevo.');
    setCreating(true);
    try {
      const created = await createSession(userId);
      localStorage.setItem(LAST_CODE_KEY, created.code);
      setCode(created.code);
    } finally {
      setCreating(false);
    }
  }, [userId]);

  const handleChangeActivity = useCallback(
    async (activity: ActivityState) => {
      if (!session) return;
      await updateSessionActivity(session.id, activity);
    },
    [session],
  );

  const handleChangeTrack = useCallback(
    async (track: TrackType) => {
      if (!session) return;
      await updateSessionTrack(session.id, track);
    },
    [session],
  );

  if (!unlocked) {
    return <ModeratorGate onUnlock={() => setUnlocked(true)} />;
  }

  if (authLoading) {
    return <LoadingScreen label="Preparando identidad del presentador…" />;
  }

  if (authError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorBanner message={authError} />
      </div>
    );
  }

  if (code && sessionLoading) {
    return <LoadingScreen label="Recuperando tu sesión…" />;
  }

  if (!isOwner || !session) {
    return <CreateSessionScreen onCreate={handleCreate} />;
  }

  if (creating) {
    return <LoadingScreen label="Creando sesión…" />;
  }

  return (
    <ModeratorDashboard
      session={session}
      participants={participants}
      icebreakerResponses={icebreakerResponses}
      assessmentResponses={assessmentResponses}
      onChangeActivity={handleChangeActivity}
      onChangeTrack={handleChangeTrack}
    />
  );
}
