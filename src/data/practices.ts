import { PracticeKey, ParticipantRole } from '../types/domain';

export interface MaturityLevelOption {
  level: 1 | 2 | 3;
  label: 'Inicial' | 'En desarrollo' | 'Consolidado';
  description: string;
}

export interface Practice {
  key: PracticeKey;
  order: number;
  title: string;
  shortTitle: string;
  levels: [MaturityLevelOption, MaturityLevelOption, MaturityLevelOption];
}

export const AI_BLOCK_RULE =
  'Una práctica en nivel Inicial bloquea el uso de IA en esa área hasta subirla a En desarrollo.';

export const PRACTICES: Practice[] = [
  {
    key: 'version_control',
    order: 1,
    title: 'Control de versiones',
    shortTitle: 'Versionado',
    levels: [
      { level: 1, label: 'Inicial', description: 'Ramas largas, sin PR' },
      { level: 2, label: 'En desarrollo', description: 'PR con revisión parcial' },
      { level: 3, label: 'Consolidado', description: 'Trunk-based y PR pequeños' },
    ],
  },
  {
    key: 'ci_cd',
    order: 2,
    title: 'CI/CD',
    shortTitle: 'CI/CD',
    levels: [
      { level: 1, label: 'Inicial', description: 'Build y despliegue manual' },
      { level: 2, label: 'En desarrollo', description: 'CI, pero despliegue manual' },
      { level: 3, label: 'Consolidado', description: 'Despliegue diario y reversible' },
    ],
  },
  {
    key: 'automated_testing',
    order: 3,
    title: 'Pruebas automatizadas',
    shortTitle: 'Pruebas',
    levels: [
      { level: 1, label: 'Inicial', description: 'Pruebas manuales' },
      { level: 2, label: 'En desarrollo', description: 'Unitarias fuera del pipeline' },
      { level: 3, label: 'Consolidado', description: 'Pirámide dentro del pipeline' },
    ],
  },
  {
    key: 'devops_culture',
    order: 4,
    title: 'Cultura DevOps',
    shortTitle: 'Cultura',
    levels: [
      { level: 1, label: 'Inicial', description: 'Ops separado de Dev' },
      { level: 2, label: 'En desarrollo', description: 'IaC parcial, solo logs' },
      { level: 3, label: 'Consolidado', description: 'IaC y observabilidad completa' },
    ],
  },
  {
    key: 'devsecops',
    order: 5,
    title: 'DevSecOps',
    shortTitle: 'DevSecOps',
    levels: [
      { level: 1, label: 'Inicial', description: 'Seguridad al final' },
      { level: 2, label: 'En desarrollo', description: 'Escaneos ocasionales' },
      { level: 3, label: 'Consolidado', description: 'SAST y dependencias en cada PR' },
    ],
  },
  {
    key: 'code_quality',
    order: 6,
    title: 'Calidad de código',
    shortTitle: 'Calidad',
    levels: [
      { level: 1, label: 'Inicial', description: 'Sin estándares comunes' },
      { level: 2, label: 'En desarrollo', description: 'Linters; deuda invisible' },
      { level: 3, label: 'Consolidado', description: 'Deuda medida y priorizada' },
    ],
  },
  {
    key: 'clear_requirements',
    order: 7,
    title: 'Requisitos claros',
    shortTitle: 'Requisitos',
    levels: [
      { level: 1, label: 'Inicial', description: 'Historias sin criterios' },
      { level: 2, label: 'En desarrollo', description: 'Criterios en algunas historias' },
      { level: 3, label: 'Consolidado', description: 'Criterios y DoD acordados' },
    ],
  },
  {
    key: 'dora_metrics',
    order: 8,
    title: 'Métricas DORA',
    shortTitle: 'DORA',
    levels: [
      { level: 1, label: 'Inicial', description: 'No se mide' },
      { level: 2, label: 'En desarrollo', description: 'Medición manual ocasional' },
      { level: 3, label: 'Consolidado', description: 'Cuatro métricas automáticas' },
    ],
  },
];

export const ICEBREAKER_QUESTION =
  '¿Qué tanto confías en el código generado por IA que llega a producción hoy?';

export const ICEBREAKER_SCALE: { score: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { score: 1, label: 'Ninguna confianza' },
  { score: 2, label: 'Poca confianza' },
  { score: 3, label: 'Confianza media' },
  { score: 4, label: 'Bastante confianza' },
  { score: 5, label: 'Confianza total' },
];

export const ROLE_OPTIONS: { value: ParticipantRole; label: string }[] = [
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'devops', label: 'DevOps' },
  { value: 'qa', label: 'QA' },
  { value: 'lead', label: 'Lead' },
  { value: 'other', label: 'Otro' },
];
