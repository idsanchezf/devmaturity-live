import { useEffect, useMemo, useState } from 'react';
import { useAnonUser } from '@/hooks/useAnonUser';
import { useSessionByCode } from '@/hooks/useSession';
import { useParticipant } from '@/hooks/useParticipant';
import {
  fetchMyAssessmentResponses,
  fetchMyIcebreakerVote,
  submitAssessmentLevel,
  submitIcebreakerVote,
} from '@/lib/responses';
import { AssessmentResponseRow, IcebreakerResponseRow, MaturityLevel, PracticeKey } from '@/types/domain';
import { PRACTICES } from '@/data/practices';
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

export function ParticipantPage() {
  const [code, setCode] = useState<string | null>(() => readSessionCodeFromUrl());
  const { userId, loading: authLoading, error: authError } = useAnonUser();
  const { session, loading: sessionLoading, error: sessionError, notFound } = useSessionByCode(code);
  const { participant, loading: participantLoading, join } = useParticipant(session?.id ?? null, userId);

  const [icebreakerVote, setIcebreakerVote] = useState<IcebreakerResponseRow | null>(null);
  const [assessmentResponses, setAssessmentResponses] = useState<AssessmentResponseRow[]>([]);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [finishedAssessment, setFinishedAssessment] = useState(false);

  useEffect(() => {
    if (!session?.id || !userId || !participant) return;
    let cancelled = false;

    Promise.all([fetchMyIcebreakerVote(session.id, userId), fetchMyAssessmentResponses(session.id, userId)])
      .then(([vote, responses]) => {
        if (cancelled) return;
        setIcebreakerVote(vote);
        setAssessmentResponses(responses);
        setFinishedAssessment(responses.length >= PRACTICES.length);
        setProgressLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setProgressLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.id, userId, participant]);

  const handleAnswerAssessment = async (practiceKey: PracticeKey, level: MaturityLevel) => {
    if (!session || !userId || !participant) return;
    const row = await submitAssessmentLevel(session.id, participant.id, userId, practiceKey, level);
    setAssessmentResponses((prev) => {
      const next = prev.filter((r) => r.practice_key !== practiceKey);
      return [...next, row];
    });
  };

  const handleVoteIcebreaker = async (score: 1 | 2 | 3 | 4 | 5) => {
    if (!session || !userId || !participant) return;
    const row = await submitIcebreakerVote(session.id, participant.id, userId, score);
    setIcebreakerVote(row);
  };

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
      return <OnboardingForm sessionCode={session.code} onSubmit={async (name, role) => { await join(name, role); }} />;
    }
    if (!progressLoaded) {
      return <LoadingScreen label="Cargando tu progreso…" />;
    }

    if (session.current_activity === 'waiting') {
      return <WaitingRoom participantName={participant.name} />;
    }

    if (session.current_activity === 'icebreaker') {
      return <IcebreakerVote initialScore={icebreakerVote?.score ?? null} onVote={handleVoteIcebreaker} />;
    }

    if (session.current_activity === 'assessment') {
      if (finishedAssessment) {
        return <ResultsRadar participantName={participant.name} responses={assessmentResponses} />;
      }
      return (
        <AssessmentCarousel
          initialResponses={assessmentResponses}
          onAnswer={handleAnswerAssessment}
          onFinish={() => setFinishedAssessment(true)}
        />
      );
    }

    return <ResultsRadar participantName={participant.name} responses={assessmentResponses} />;
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
    progressLoaded,
    icebreakerVote,
    finishedAssessment,
    assessmentResponses,
  ]);

  return content;
}
