import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar as RadarArea,
  RadarChart as ReRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface RadarAxisDatum {
  shortTitle: string;
  value: number;
  blocksAI?: boolean;
}

interface MaturityRadarProps {
  data: RadarAxisDatum[];
  color?: string;
  heightClassName?: string;
  secondarySeries?: { data: RadarAxisDatum[]; color: string; label: string };
}

/**
 * Radar de madurez con 8 ejes (1..3). Acepta una segunda serie opcional para
 * comparar "yo" vs "la sala" en la misma vista.
 */
export function MaturityRadarChart({ data, color = '#4f6df5', heightClassName = 'h-72' }: MaturityRadarProps) {
  const chartData = data.map((d) => ({ axis: d.shortTitle, Nivel: Number(d.value.toFixed(2)) }));

  return (
    <div className={heightClassName}>
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart data={chartData} outerRadius="75%">
          <PolarGrid stroke="#272f48" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: '#cbd5e1', fontSize: 11, fontFamily: 'monospace' }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 3]}
            tickCount={4}
            tick={{ fill: '#64748b', fontSize: 10 }}
            stroke="#272f48"
          />
          <RadarArea
            name="Nivel"
            dataKey="Nivel"
            stroke={color}
            fill={color}
            fillOpacity={0.35}
            strokeWidth={2}
            dot
          />
          <Tooltip
            contentStyle={{ background: '#111627', border: '1px solid #272f48', borderRadius: 8 }}
            labelStyle={{ color: '#e2e8f0' }}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
