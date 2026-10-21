import { IcebreakerResponseRow } from '@/types/domain';
import { aggregateIcebreaker } from '@/utils/scoring';
import { IcebreakerBarChart } from '@/components/charts/IcebreakerBarChart';
import { Card } from '@/components/common/Card';
import { ICEBREAKER_QUESTION } from '@/data/practices';

export function IcebreakerPanel({ responses }: { responses: IcebreakerResponseRow[] }) {
  const aggregate = aggregateIcebreaker(responses);

  return (
    <Card>
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent-400">Ice Breaker en vivo</p>
      <h2 className="mb-4 text-sm text-slate-300">{ICEBREAKER_QUESTION}</h2>
      <IcebreakerBarChart aggregate={aggregate} />
      <div className="mt-3 flex items-center justify-between font-mono text-sm text-slate-400">
        <span>{aggregate.total} votantes</span>
        <span>
          Promedio: <span className="font-semibold text-accent-400">{aggregate.average.toFixed(1)}</span> / 5
        </span>
      </div>
    </Card>
  );
}
