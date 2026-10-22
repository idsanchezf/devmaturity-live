import { useEffect, useMemo, useRef, useState } from 'react';
import { useAnonUser } from '@/hooks/useAnonUser';
import { useSessionByCode } from '@/hooks/useSession';
import { useParticipant } from '@/hooks/useParticipant';
import {
  fetchMyAssessmentResponses,
  fetchMyIcebreakerVote,
  submitAssessmentLevel,
  submitIcebreakerVote,
} from '@/lib/responses';
import { AssessmentResponseRow, IcebreakerResponseRow, MaturityLevel, PracticeKey, TrackType } from '@/types/domain';
import { TRACKS } from '@/data/practices';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { JoinSessionGate, SessionNotFound } from '@/components/participant/JoinSessionGate';
import { OnboardingForm } from '@/components/participant/OnboardingForm';
import { WaitingRoom } from '@/components/participant/WaitingRoom';
import { IcebreakerVote } from '@/components/participant/IcebreakerVote';
import { AssessmentCarousel } from '@/components/participant/AssessmentCarousel';
import { ResultsRadar } from '@/components/participant/ResultsRadar';

function readSessionCodeFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('session');
}

// Per-track progress cache, keyed by track
interface TrackProgress {
  icebreakerVote: IcebreakerResponseRow | null;
  assessmentResponses: AssessmentResponseRow[];
  loaded: boolean;
  finished: boolean;
}

function emptyProgress(): TrackProgress {
  return { icebreakerVote: null, assessmentResponses: [], loaded: false, finished: false };
}

export function ParticipantPage() {
  const [code, setCode] = useState<string | null>(() => readSessionCodeFromUrl());
  const { userId, loading: authLoading, error: authError } = useAnonUser();
  const { session, loading: sessionLoading, error: sessionError, notFound } = useSessionByCode(code);
  const { participant, loading: participantLoading, join } = useParticipant(session?.id ?? null, userId);

  // Per-track progress map — we keep progress from both tracks cached so
  // switching back does not require a re-fetch.
  const [progressMap, setProgressMap] = useState<Partial<Record<TrackType, TrackProgress>>>({});
  // Track which track's progress is currently being loaded (to avoid double-fetch)
  const loadingTrackRef = useRef<TrackType | null>(null);

  const activeTrack: TrackType = session?.track ?? 'devops';

  // -------------------------------------------------------------------------
  // Load progress for the active track whenever session/user/participant are ready
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!session?.id || !userId || !participant) return;
    const track = activeTrack;

    // If already loaded or currently loading this track, skip
    if (progressMap[track]?.loaded) return;
    if (loadingTrackRef.current === track) return;

    let cancelled = false;
    loadingTrackRef.current = track;

    Promise.all([
      fetchMyIcebreakerVote(session.id, userId, track),
      fetchMyAssessmentResponses(session.id, userId, track),
    ])
      .then(([vote, responses]) => {
        if (cancelled) return;
        const practiceCount = TRACKS[track].practices.length;
        setProgressMap((prev) => ({
          ...prev,
          [track]: {
            icebreakerVote: vote,
            assessmentResponses: responses,
            loaded: true,
            finished: responses.length >= practiceCount,
          },
        }));
      })
      .catch(() => {
        if (cancelled) return;
        setProgressMap((prev) => ({
          ...prev,
          [track]: { ...emptyProgress(), loaded: true },
        }));
      })
      .finally(() => {
        if (loadingTrackRef.current === track) loadingTrackRef.current = null;
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id, userId, participant, activeTrack]);

  const currentProgress = progressMap[activeTrack] ?? emptyProgress();

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleAnswerAssessment = async (practiceKey: PracticeKey, level: MaturityLevel) => {
    if (!session || !userId || !participant) return;
    const row = await submitAssessmentLevel(session.id, participant.id, userId, practiceKey, level, activeTrack);
    setProgressMap((prev) => {
      const existing = prev[activeTrack] ?? emptyProgress();
      const next = existing.assessmentResponses.filter((r) => r.practice_key !== practiceKey);
      return {
        ...prev,
        [activeTrack]: { ...existing, assessmentResponses: [...next, row] },
      };
    });
  };

  const handleVoteIcebreaker = async (score: 1 | 2 | 3 | 4 | 5) => {
    if (!session || !userId || !participant) return;
    const row = await submitIcebreakerVote(session.id, participant.id, userId, score, activeTrack);
    setProgressMap((prev) => ({
      ...prev,
      [activeTrack]: { ...(prev[activeTrack] ?? emptyProgress()), icebreakerVote: row },
    }));
  };

  const handleFinishAssessment = () => {
    setProgressMap((prev) => ({
      ...prev,
      [activeTrack]: { ...(prev[activeTrack] ?? emptyProgress()), finished: true },
    }));
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  const content = useMemo(() => {
    if (!code) {
      return <JoinSessionGate onResolve={setCode} />;
    }
    if (authLoading || sessionLoading) {
      return <LoadingScreen label="Conectando con la sesión…" />;
    }
    if (authError || sessionError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4">
          <ErrorBanner message={authError ?? sessionError ?? 'Error desconocido.'} />
        </div>
      );
    }
    if (notFound || !session) {
      return <SessionNotFound code={code} />;
    }
    if (participantLoading) {
      return <LoadingScreen label="Verificando tu lugar en la sesión…" />;
    }
    if (!participant) {
      return (
        <OnboardingForm
          sessionCode={session.code}
          onSubmit={async (name, role) => {
            await join(name, role);
          }}
        />
      );
    }
    if (!currentProgress.loaded) {
      return <LoadingScreen label="Cargando tu progreso…" />;
    }

    if (session.current_activity === 'waiting') {
      return <WaitingRoom participantName={participant.name} />;
    }

    if (session.current_activity === 'icebreaker') {
      return (
        <IcebreakerVote
          initialScore={currentProgress.icebreakerVote?.score ?? null}
          track={activeTrack}
          onVote={handleVoteIcebreaker}
        />
      );
    }

    if (session.current_activity === 'assessment') {
      if (currentProgress.finished) {
        return (
          <ResultsRadar
            participantName={participant.name}
            responses={currentProgress.assessmentResponses}
            track={activeTrack}
          />
        );
      }
      return (
        <AssessmentCarousel
          initialResponses={currentProgress.assessmentResponses}
          track={activeTrack}
          onAnswer={handleAnswerAssessment}
          onFinish={handleFinishAssessment}
        />
      );
    }

    return (
      <ResultsRadar
        participantName={participant.name}
        responses={currentProgress.assessmentResponses}
        track={activeTrack}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    code,
    authLoading,
    sessionLoading,
    authError,
    sessionError,
    notFound,
    session,
    participantLoading,
    participant,
    currentProgress,
    activeTrack,
  ]);

  return content;
}
