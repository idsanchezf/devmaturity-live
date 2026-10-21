import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { IcebreakerAggregate } from '@/utils/scoring';

const BAR_COLORS = ['#ef4444', '#f59e0b', '#eab308', '#60a5fa', '#22c55e'];

export function IcebreakerBarChart({ aggregate }: { aggregate: IcebreakerAggregate }) {
  const data = aggregate.distribution.map((d, i) => ({
    score: `${d.score}`,
    votos: d.count,
    fill: BAR_COLORS[i],
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1b2236" vertical={false} />
          <XAxis dataKey="score" tick={{ fill: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }} />
          <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: '#111627', border: '1px solid #272f48', borderRadius: 8 }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(value: number) => [`${value} voto(s)`, 'Votos']}
          />
          <Bar dataKey="votos" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.score} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
