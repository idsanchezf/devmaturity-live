import { supabase } from '@/lib/supabase';
import {
  AssessmentResponseRow,
  IcebreakerResponseRow,
  MaturityLevel,
  ParticipantRole,
  PracticeKey,
  TrackType,
} from '@/types/domain';

export async function joinSession(
  sessionId: string,
  userId: string,
  name: string,
  role: ParticipantRole,
) {
  const trimmed = name.trim().slice(0, 40);
  if (trimmed.length === 0) {
    throw new Error('El nombre no puede estar vacío.');
  }

  const { data, error } = await supabase
    .from('participants')
    .upsert(
      { session_id: sessionId, user_id: userId, name: trimmed, role },
      { onConflict: 'session_id,user_id' },
    )
    .select('*')
    .single();

  if (error) throw new Error(`No se pudo unir a la sesión: ${error.message}`);
  return data;
}

export async function fetchMyParticipant(sessionId: string, userId: string) {
  const { data, error } = await supabase
    .from('participants')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error(`No se pudo leer el participante: ${error.message}`);
  return data;
}

export async function submitIcebreakerVote(
  sessionId: string,
  participantId: string,
  userId: string,
  score: 1 | 2 | 3 | 4 | 5,
  track: TrackType,
): Promise<IcebreakerResponseRow> {
  const { data, error } = await supabase
    .from('icebreaker_responses')
    .upsert(
      { session_id: sessionId, participant_id: participantId, user_id: userId, score, track },
      { onConflict: 'session_id,user_id,track' },
    )
    .select('*')
    .single();

  if (error) throw new Error(`No se pudo registrar el voto: ${error.message}`);
  return data as IcebreakerResponseRow;
}

export async function fetchMyIcebreakerVote(
  sessionId: string,
  userId: string,
  track: TrackType,
): Promise<IcebreakerResponseRow | null> {
  const { data, error } = await supabase
    .from('icebreaker_responses')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .eq('track', track)
    .maybeSingle();

  if (error) throw new Error(`No se pudo leer el voto: ${error.message}`);
  return data as IcebreakerResponseRow | null;
}

export async function submitAssessmentLevel(
  sessionId: string,
  participantId: string,
  userId: string,
  practiceKey: PracticeKey,
  level: MaturityLevel,
  track: TrackType,
): Promise<AssessmentResponseRow> {
  const { data, error } = await supabase
    .from('assessment_responses')
    .upsert(
      { session_id: sessionId, participant_id: participantId, user_id: userId, practice_key: practiceKey, level, track },
      { onConflict: 'session_id,user_id,practice_key,track' },
    )
    .select('*')
    .single();

  if (error) throw new Error(`No se pudo guardar la respuesta: ${error.message}`);
  return data as AssessmentResponseRow;
}

export async function fetchMyAssessmentResponses(
  sessionId: string,
  userId: string,
  track: TrackType,
): Promise<AssessmentResponseRow[]> {
  const { data, error } = await supabase
    .from('assessment_responses')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_id', userId)
    .eq('track', track);

  if (error) throw new Error(`No se pudieron leer las respuestas: ${error.message}`);
  return (data ?? []) as AssessmentResponseRow[];
}
