import { PracticeKey, ParticipantRole, TrackType } from '../types/domain';

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

export interface TrackIcebreaker {
  question: string;
  minLabel: string;
  maxLabel: string;
}

export interface TrackConfig {
  id: TrackType;
  name: string;
  iceBreaker: TrackIcebreaker;
  practices: Practice[];
  hasAiBlockRule: boolean;
  aiBlockRuleText?: string;
}

// ---------------------------------------------------------------------------
// DevOps track
// ---------------------------------------------------------------------------

export const AI_BLOCK_RULE =
  'Una práctica en nivel Inicial bloquea el uso de IA en esa área hasta subirla a En desarrollo.';

const DEVOPS_PRACTICES: Practice[] = [
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

// ---------------------------------------------------------------------------
// Agile track
// ---------------------------------------------------------------------------

const AGILE_PRACTICES: Practice[] = [
  {
    key: 'psychological_safety',
    order: 1,
    title: 'Seguridad psicológica',
    shortTitle: 'Seg. psicológica',
    levels: [
      { level: 1, label: 'Inicial', description: 'El error se castiga o se oculta; temor a pedir ayuda.' },
      { level: 2, label: 'En desarrollo', description: 'Se admiten errores en retrospectivas, pero con reservas.' },
      { level: 3, label: 'Consolidado', description: 'Vulnerabilidad natural, aprendizaje implícito sin culpables.' },
    ],
  },
  {
    key: 'value_focus',
    order: 2,
    title: 'Foco en valor vs. Output',
    shortTitle: 'Foco en valor',
    levels: [
      { level: 1, label: 'Inicial', description: 'El éxito se mide por cerrar tickets u horas trabajadas.' },
      { level: 2, label: 'En desarrollo', description: 'Se habla de negocio, pero prima el volumen de tareas.' },
      { level: 3, label: 'Consolidado', description: 'Obsesión colectiva por el impacto real en el usuario.' },
    ],
  },
  {
    key: 'collaboration',
    order: 3,
    title: 'Colaboración vs. Silos',
    shortTitle: 'Colaboración',
    levels: [
      { level: 1, label: 'Inicial', description: 'Trabajo individualista, traspaso de tareas por "muros".' },
      { level: 2, label: 'En desarrollo', description: 'Comunicación reactiva cuando hay bloqueos críticos.' },
      { level: 3, label: 'Consolidado', description: 'Co-creación fluida, swarm/pair programming y apoyo mutuo.' },
    ],
  },
  {
    key: 'change_response',
    order: 4,
    title: 'Respuesta al cambio',
    shortTitle: 'Resp. al cambio',
    levels: [
      { level: 1, label: 'Inicial', description: 'Frustración y resistencia ante cambios de prioridad.' },
      { level: 2, label: 'En desarrollo', description: 'Se aceptan cambios, pero generan desorden o retraso.' },
      { level: 3, label: 'Consolidado', description: 'Adaptación orgánica; replanificación ágil orientada al valor.' },
    ],
  },
  {
    key: 'autonomy',
    order: 5,
    title: 'Autonomía y toma de decisiones',
    shortTitle: 'Autonomía',
    levels: [
      { level: 1, label: 'Inicial', description: 'Dependencia total del líder o jerarquías para avanzar.' },
      { level: 2, label: 'En desarrollo', description: 'Autonomía técnica básica, pero decisiones de producto centralizadas.' },
      { level: 3, label: 'Consolidado', description: 'Equipo empoderado que decide y asume responsabilidad compartida.' },
    ],
  },
  {
    key: 'feedback_cycles',
    order: 6,
    title: 'Ciclos cortos de feedback',
    shortTitle: 'Feedback',
    levels: [
      { level: 1, label: 'Inicial', description: 'Entregas espaciadas en meses; feedback tardío del usuario.' },
      { level: 2, label: 'En desarrollo', description: 'Demostraciones internas frecuentes sin usuarios reales.' },
      { level: 3, label: 'Consolidado', description: 'Validación continua y directa con usuarios/datos de uso.' },
    ],
  },
  {
    key: 'experimentation',
    order: 7,
    title: 'Experimentación y gestión del riesgo',
    shortTitle: 'Experimentación',
    levels: [
      { level: 1, label: 'Inicial', description: 'Parálisis por análisis o aversión total a probar cosas nuevas.' },
      { level: 2, label: 'En desarrollo', description: 'Pruebas aisladas si sobra tiempo o no hay presión.' },
      { level: 3, label: 'Consolidado', description: 'Hipótesis pequeñas, fallos baratos y experimentación constante.' },
    ],
  },
  {
    key: 'continuous_improvement',
    order: 8,
    title: 'Mejora continua sistemática',
    shortTitle: 'Mejora continua',
    levels: [
      { level: 1, label: 'Inicial', description: 'Las retrospectivas no se hacen o son sesiones de quejas vacías.' },
      { level: 2, label: 'En desarrollo', description: 'Se definen compromisos de mejora, pero rara vez se ejecutan.' },
      { level: 3, label: 'Consolidado', description: 'Acciones concretas integradas de inmediato al ritmo diario.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Track registry
// ---------------------------------------------------------------------------

export const TRACKS: Record<TrackType, TrackConfig> = {
  devops: {
    id: 'devops',
    name: 'DevOps',
    iceBreaker: {
      question: '¿Qué tanto confías en el código generado por IA que llega a producción hoy?',
      minLabel: 'Ninguna confianza',
      maxLabel: 'Confianza total',
    },
    practices: DEVOPS_PRACTICES,
    hasAiBlockRule: true,
    aiBlockRuleText: AI_BLOCK_RULE,
  },
  agile: {
    id: 'agile',
    name: 'Agilidad',
    iceBreaker: {
      question:
        'Del 1 al 5, cuando surge un cambio inesperado en las prioridades, ¿qué tan rápido y sin fricción nos adaptamos como equipo?',
      minLabel: 'Resistencia y frustración total',
      maxLabel: 'Pivotamos con fluidez y foco en valor',
    },
    practices: AGILE_PRACTICES,
    hasAiBlockRule: false,
  },
};

// ---------------------------------------------------------------------------
// Legacy exports — kept for backward compatibility with existing imports
// ---------------------------------------------------------------------------

export const PRACTICES = DEVOPS_PRACTICES;

export const ICEBREAKER_QUESTION = TRACKS.devops.iceBreaker.question;

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
