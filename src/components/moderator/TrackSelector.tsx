import { TrackType } from '@/types/domain';
import { TRACKS } from '@/data/practices';
import { Zap, Layers } from 'lucide-react';

const TRACK_ICONS: Record<TrackType, typeof Zap> = {
  devops: Zap,
  agile: Layers,
};

interface TrackSelectorProps {
  current: TrackType;
  onChange: (track: TrackType) => void;
  disabled?: boolean;
}

export function TrackSelector({ current, onChange, disabled }: TrackSelectorProps) {
  const tracks: TrackType[] = ['devops', 'agile'];

  return (
    <div className="flex items-center gap-1 rounded-xl border border-ink-600 bg-ink-900 p-1">
      {tracks.map((t) => {
        const Icon = TRACK_ICONS[t];
        const active = current === t;
        return (
          <button
            key={t}
            disabled={disabled}
            onClick={() => onChange(t)}
            className={`tap-highlight-none flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
              active
                ? 'bg-accent-500 text-white shadow-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon size={13} />
            {TRACKS[t].name}
          </button>
        );
      })}
    </div>
  );
}
