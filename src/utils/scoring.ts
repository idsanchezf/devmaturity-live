import { PRACTICES } from '@/data/practices';
import { AssessmentResponseRow, IcebreakerResponseRow, MaturityLevel, PracticeKey } from '@/types/domain';

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
 * redondeado de la sala cae en nivel 1 (Inicial). Esto evita que un solo
 * voto aislado tiña el semáforo grupal, pero sigue siendo estricto.
 */
export function aggregateAssessment(rows: AssessmentResponseRow[]): PracticeAggregate[] {
  return PRACTICES.map((practice) => {
    const practiceRows = rows.filter((r) => r.practice_key === practice.key);
    const total = practiceRows.reduce((sum, r) => sum + r.level, 0);
    const average = practiceRows.length > 0 ? total / practiceRows.length : 0;
    const initialCount = practiceRows.filter((r) => r.level === 1).length;

    return {
      key: practice.key,
      title: practice.title,
      shortTitle: practice.shortTitle,
      average,
      responses: practiceRows.length,
      initialCount,
      blocksAI: practiceRows.length > 0 && Math.round(average) === 1,
    };
  });
}

export function individualRadarData(rows: AssessmentResponseRow[]) {
  return PRACTICES.map((practice) => {
    const row = rows.find((r) => r.practice_key === practice.key);
    return {
      key: practice.key,
      shortTitle: practice.shortTitle,
      level: (row?.level ?? 0) as MaturityLevel | 0,
      blocksAI: row?.level === 1,
    };
  });
}

export function completedPracticeKeys(rows: AssessmentResponseRow[]): Set<PracticeKey> {
  return new Set(rows.map((r) => r.practice_key));
}

export interface IcebreakerAggregate {
  distribution: { score: 1 | 2 | 3 | 4 | 5; count: number }[];
  average: number;
  total: number;
}

export function aggregateIcebreaker(rows: IcebreakerResponseRow[]): IcebreakerAggregate {
  const distribution: IcebreakerAggregate['distribution'] = [1, 2, 3, 4, 5].map((score) => ({
    score: score as 1 | 2 | 3 | 4 | 5,
    count: rows.filter((r) => r.score === score).length,
  }));
  const total = rows.length;
  const average = total > 0 ? rows.reduce((sum, r) => sum + r.score, 0) / total : 0;
  return { distribution, average, total };
}
