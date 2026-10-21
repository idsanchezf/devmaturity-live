import { ShieldAlert } from 'lucide-react';
import { Practice } from '@/data/practices';
import { MaturityLevel } from '@/types/domain';

interface PracticeCardProps {
  practice: Practice;
  index: number;
  total: number;
  selected: MaturityLevel | null;
  onSelect: (level: MaturityLevel) => void;
}

export function PracticeCard({ practice, index, total, selected, onSelect }: PracticeCardProps) {
  return (
    <div className="flex h-full flex-col">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent-400">
        Práctica {index + 1} / {total}
      </p>
      <h2 className="mb-4 text-lg font-semibold text-slate-100">{practice.title}</h2>

      <div className="flex flex-1 flex-col gap-3">
        {practice.levels.map((lvl) => {
          const isSelected = selected === lvl.level;
          const isBlocking = lvl.level === 1;
          return (
            <button
              key={lvl.level}
              onClick={() => onSelect(lvl.level)}
              className={`tap-highlight-none rounded-xl border p-4 text-left transition active:scale-[0.98] ${
                isSelected
                  ? isBlocking
                    ? 'border-signal-block bg-signal-block/15'
                    : 'border-accent-500 bg-accent-500/15'
                  : 'border-ink-600 bg-ink-900'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-mono text-[11px] font-semibold uppercase tracking-wide ${
                    isSelected ? (isBlocking ? 'text-signal-block' : 'text-accent-400') : 'text-slate-500'
                  }`}
                >
                  {lvl.label}
                </span>
                {isBlocking && isSelected && (
                  <span className="flex items-center gap-1 rounded-full bg-signal-block/20 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                    <ShieldAlert size={12} /> Bloquea IA
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-slate-200">{lvl.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
