import { TRACKS } from '@/data/practices';
import { AssessmentResponseRow, IcebreakerResponseRow, MaturityLevel, PracticeKey, TrackType } from '@/types/domain';

export interface PracticeAggregate {
  key: PracticeKey;
  title: string;
  shortTitle: string;
  average: number;
  responses: number;
  blocksAI: boolean;
  initialCount: number;
}

/**
 * Regla de negocio: una práctica en nivel Inicial bloquea el uso de IA en esa
 * área. A nivel de equipo, consideramos "bloqueada" cuando el promedio
 * redondeado de la sala cae en nivel 1 (Inicial). Solo aplica al track DevOps.
 */
export function aggregateAssessment(
  rows: AssessmentResponseRow[],
  track: TrackType = 'devops',
): PracticeAggregate[] {
  const trackConfig = TRACKS[track];
  const trackRows = rows.filter((r) => r.track === track);

  return trackConfig.practices.map((practice) => {
    const practiceRows = trackRows.filter((r) => r.practice_key === practice.key);
    const total = practiceRows.reduce((sum, r) => sum + r.level, 0);
    const average = practiceRows.length > 0 ? total / practiceRows.length : 0;
    const initialCount = practiceRows.filter((r) => r.level === 1).length;
    const blocksAI = trackConfig.hasAiBlockRule && practiceRows.length > 0 && Math.round(average) === 1;

    return {
      key: practice.key,
      title: practice.title,
      shortTitle: practice.shortTitle,
      average,
      responses: practiceRows.length,
      initialCount,
      blocksAI,
    };
  });
}

export function individualRadarData(rows: AssessmentResponseRow[], track: TrackType = 'devops') {
  const trackConfig = TRACKS[track];
  const trackRows = rows.filter((r) => r.track === track);

  return trackConfig.practices.map((practice) => {
    const row = trackRows.find((r) => r.practice_key === practice.key);
    return {
      key: practice.key,
      shortTitle: practice.shortTitle,
      level: (row?.level ?? 0) as MaturityLevel | 0,
      blocksAI: trackConfig.hasAiBlockRule && row?.level === 1,
    };
  });
}

export function completedPracticeKeys(rows: AssessmentResponseRow[], track: TrackType = 'devops'): Set<PracticeKey> {
  return new Set(rows.filter((r) => r.track === track).map((r) => r.practice_key));
}

export interface IcebreakerAggregate {
  distribution: { score: 1 | 2 | 3 | 4 | 5; count: number }[];
  average: number;
  total: number;
}

export function aggregateIcebreaker(
  rows: IcebreakerResponseRow[],
  track?: TrackType,
): IcebreakerAggregate {
  const filtered = track ? rows.filter((r) => r.track === track) : rows;
  const distribution: IcebreakerAggregate['distribution'] = [1, 2, 3, 4, 5].map((score) => ({
    score: score as 1 | 2 | 3 | 4 | 5,
    count: filtered.filter((r) => r.score === score).length,
  }));
  const total = filtered.length;
  const average = total > 0 ? filtered.reduce((sum, r) => sum + r.score, 0) / total : 0;
  return { distribution, average, total };
}
