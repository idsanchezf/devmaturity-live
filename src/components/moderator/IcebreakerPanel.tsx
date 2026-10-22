import { IcebreakerResponseRow, TrackType } from '@/types/domain';
import { aggregateIcebreaker } from '@/utils/scoring';
import { IcebreakerBarChart } from '@/components/charts/IcebreakerBarChart';
import { Card } from '@/components/common/Card';
import { TRACKS } from '@/data/practices';

interface IcebreakerPanelProps {
  responses: IcebreakerResponseRow[];
  track: TrackType;
}

export function IcebreakerPanel({ responses, track }: IcebreakerPanelProps) {
  const aggregate = aggregateIcebreaker(responses, track);
  const question = TRACKS[track].iceBreaker.question;
  const minLabel = TRACKS[track].iceBreaker.minLabel;
  const maxLabel = TRACKS[track].iceBreaker.maxLabel;

  return (
    <Card>
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent-400">Ice Breaker en vivo</p>
      <h2 className="mb-1 text-sm text-slate-300">{question}</h2>
      <div className="mb-4 flex justify-between font-mono text-[10px] text-slate-500">
        <span>1 — {minLabel}</span>
        <span>{maxLabel} — 5</span>
      </div>
      <IcebreakerBarChart aggregate={aggregate} />
      <div className="mt-3 flex items-center justify-between font-mono text-sm text-slate-400">
        <span>{aggregate.total} votante{aggregate.total === 1 ? '' : 's'}</span>
        <span>
          Promedio: <span className="font-semibold text-accent-400">{aggregate.average.toFixed(1)}</span> / 5
        </span>
      </div>
    </Card>
  );
}
