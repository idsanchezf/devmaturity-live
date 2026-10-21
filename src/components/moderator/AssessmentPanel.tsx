import { AssessmentResponseRow } from '@/types/domain';
import { aggregateAssessment } from '@/utils/scoring';
import { MaturityRadarChart } from '@/components/charts/MaturityRadarChart';
import { Card } from '@/components/common/Card';
import { AI_BLOCK_RULE } from '@/data/practices';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export function AssessmentPanel({ responses, participantsCount }: { responses: AssessmentResponseRow[]; participantsCount: number }) {
  const aggregate = aggregateAssessment(responses);
  const blocked = aggregate.filter((a) => a.blocksAI);

  return (
    <Card>
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent-400">Madurez técnica — equipo</p>
      <h2 className="mb-4 text-sm text-slate-300">
        Promedio consolidado de la sala ({participantsCount} participante{participantsCount === 1 ? '' : 's'})
      </h2>

      <MaturityRadarChart data={aggregate.map((a) => ({ shortTitle: a.shortTitle, value: a.average }))} />

      <div className="mt-4 space-y-2">
        <p className="font-mono text-[11px] uppercase tracking-wide text-slate-500">Semáforo de bloqueo IA</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {aggregate.map((a) => (
            <div
              key={a.key}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs ${
                a.blocksAI
                  ? 'border-signal-block/40 bg-signal-block/10 text-red-300'
                  : 'border-signal-ok/30 bg-signal-ok/10 text-emerald-300'
              }`}
            >
              {a.blocksAI ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
              <span className="truncate">{a.shortTitle}</span>
            </div>
          ))}
        </div>
        {blocked.length > 0 && <p className="text-xs text-red-300/80">{AI_BLOCK_RULE}</p>}
      </div>
    </Card>
  );
}
