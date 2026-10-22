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
          return (
            <button
              key={lvl.level}
              onClick={() => onSelect(lvl.level)}
              className={`tap-highlight-none rounded-xl border p-4 text-left transition active:scale-[0.98] ${
                isSelected
                  ? 'border-accent-500 bg-accent-500/15'
                  : 'border-ink-600 bg-ink-900'
              }`}
            >
              <p className="text-sm text-slate-200">{lvl.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
