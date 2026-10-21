import { ActivityState } from '@/types/domain';
import { Card } from '@/components/common/Card';
import { Hourglass, MessageCircleQuestion, ListChecks, Trophy } from 'lucide-react';

const STEPS: { value: ActivityState; label: string; icon: typeof Hourglass }[] = [
  { value: 'waiting', label: 'Espera', icon: Hourglass },
  { value: 'icebreaker', label: 'Ice Breaker', icon: MessageCircleQuestion },
  { value: 'assessment', label: 'Autoevaluación', icon: ListChecks },
  { value: 'results', label: 'Resultados', icon: Trophy },
];

export function ActivityControls({
  current,
  onChange,
  disabled,
}: {
  current: ActivityState;
  onChange: (activity: ActivityState) => void;
  disabled?: boolean;
}) {
  return (
    <Card>
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent-400">Control de actividad</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const active = current === step.value;
          return (
            <button
              key={step.value}
              disabled={disabled}
              onClick={() => onChange(step.value)}
              className={`tap-highlight-none flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-semibold transition disabled:opacity-50 ${
                active
                  ? 'border-accent-500 bg-accent-500/15 text-accent-300'
                  : 'border-ink-600 bg-ink-900 text-slate-400 hover:border-ink-600/80'
              }`}
            >
              <Icon size={18} />
              {step.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
