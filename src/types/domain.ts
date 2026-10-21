export type ActivityState = 'waiting' | 'icebreaker' | 'assessment' | 'results';

export type ParticipantRole = 'backend' | 'frontend' | 'devops' | 'qa' | 'lead' | 'other';

export type PracticeKey =
  | 'version_control'
  | 'ci_cd'
  | 'automated_testing'
  | 'devops_culture'
  | 'devsecops'
  | 'code_quality'
  | 'clear_requirements'
  | 'dora_metrics';

export type MaturityLevel = 1 | 2 | 3;

export interface SessionRow {
  id: string;
  code: string;
  moderator_user_id: string;
  current_activity: ActivityState;
  created_at: string;
  updated_at: string;
}

export interface ParticipantRow {
  id: string;
  session_id: string;
  user_id: string;
  name: string;
  role: ParticipantRole;
  created_at: string;
}

export interface IcebreakerResponseRow {
  id: string;
  session_id: string;
  participant_id: string;
  user_id: string;
  score: 1 | 2 | 3 | 4 | 5;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResponseRow {
  id: string;
  session_id: string;
  participant_id: string;
  user_id: string;
  practice_key: PracticeKey;
  level: MaturityLevel;
  created_at: string;
  updated_at: string;
}
