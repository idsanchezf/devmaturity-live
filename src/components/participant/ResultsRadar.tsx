import { AssessmentResponseRow, TrackType } from '@/types/domain';
import { individualRadarData } from '@/utils/scoring';
import { MaturityRadarChart } from '@/components/charts/MaturityRadarChart';
import { Card } from '@/components/common/Card';
import { Logo } from '@/components/common/Logo';
import { TRACKS } from '@/data/practices';
import { ShieldAlert, Sparkles } from 'lucide-react';

interface ResultsRadarProps {
  participantName: string;
  responses: AssessmentResponseRow[];
  track: TrackType;
}

export function ResultsRadar({ participantName, responses, track }: ResultsRadarProps) {
  const trackConfig = TRACKS[track];
  const data = individualRadarData(responses, track);
  const blocked = data.filter((d) => d.blocksAI);
  const trackResponses = responses.filter((r) => r.track === track);
  const overallAvg =
    trackResponses.length > 0
      ? trackResponses.reduce((s, r) => s + r.level, 0) / trackResponses.length
      : 0;

  return (
    <div className="flex min-h-screen flex-col items-center gap-5 px-4 py-8">
      <Logo compact />
      <Card className="w-full max-w-md">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent-400">Tu resultado</p>
        <h1 className="mb-4 text-lg font-semibold text-slate-100">
          {participantName}, así ves la madurez de tu equipo
        </h1>

        <MaturityRadarChart data={data.map((d) => ({ shortTitle: d.shortTitle, value: d.level }))} />

        <div className="mt-4 flex items-center justify-between rounded-xl bg-ink-900 px-4 py-3">
          <span className="text-sm text-slate-400">Promedio general</span>
          <span className="font-mono text-lg font-semibold text-accent-400">{overallAvg.toFixed(1)} / 3</span>
        </div>

        {trackConfig.hasAiBlockRule && (
          <>
            {blocked.length > 0 ? (
              <div className="mt-4 rounded-xl border border-signal-block/30 bg-signal-block/10 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-300">
                  <ShieldAlert size={16} /> Prácticas que bloquean el uso de IA
                </p>
                <ul className="mb-2 list-inside list-disc text-sm text-red-200">
                  {blocked.map((b) => (
                    <li key={b.key}>{b.shortTitle}</li>
                  ))}
                </ul>
                <p className="text-xs text-red-300/80">{trackConfig.aiBlockRuleText}</p>
              </div>
            ) : (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-signal-ok/30 bg-signal-ok/10 p-4 text-sm text-emerald-300">
                <Sparkles size={16} /> Ninguna práctica en Inicial: tu equipo tiene base para adoptar IA con cuidado.
              </div>
            )}
          </>
        )}

        {!trackConfig.hasAiBlockRule && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-accent-500/30 bg-accent-500/10 p-4 text-sm text-accent-300">
            <Sparkles size={16} /> Madurez comportamental del equipo — track {trackConfig.name}.
          </div>
        )}
      </Card>
    </div>
  );
}
