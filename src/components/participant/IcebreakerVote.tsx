import { useState } from 'react';
import { ICEBREAKER_QUESTION, ICEBREAKER_SCALE } from '@/data/practices';
import { Card } from '@/components/common/Card';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { CheckCircle2 } from 'lucide-react';

interface IcebreakerVoteProps {
  initialScore: 1 | 2 | 3 | 4 | 5 | null;
  onVote: (score: 1 | 2 | 3 | 4 | 5) => Promise<void>;
}

export function IcebreakerVote({ initialScore, onVote }: IcebreakerVoteProps) {
  const [selected, setSelected] = useState<1 | 2 | 3 | 4 | 5 | null>(initialScore);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVote = async (score: 1 | 2 | 3 | 4 | 5) => {
    setSubmitting(true);
    setError(null);
    try {
      await onVote(score);
      setSelected(score);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el voto.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <Card className="w-full max-w-md text-center">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-accent-400">Ice Breaker</p>
        <h1 className="mb-6 text-lg font-semibold leading-snug text-slate-100">{ICEBREAKER_QUESTION}</h1>

        <div className="grid grid-cols-5 gap-2">
          {ICEBREAKER_SCALE.map((opt) => (
            <button
              key={opt.score}
              disabled={submitting}
              onClick={() => handleVote(opt.score)}
              className={`tap-highlight-none flex aspect-square flex-col items-center justify-center rounded-xl border text-lg font-bold transition active:scale-95 ${
                selected === opt.score
                  ? 'border-accent-500 bg-accent-500 text-white shadow-glow'
                  : 'border-ink-600 bg-ink-900 text-slate-200'
              }`}
            >
              {opt.score}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-between font-mono text-[10px] text-slate-500">
          <span>{ICEBREAKER_SCALE[0].label}</span>
          <span>{ICEBREAKER_SCALE[4].label}</span>
        </div>

        {selected !== null && (
          <p className="mt-5 flex items-center justify-center gap-1.5 text-sm text-signal-ok">
            <CheckCircle2 size={16} /> Voto registrado — puedes cambiarlo mientras esperamos.
          </p>
        )}

        {error && (
          <div className="mt-4">
            <ErrorBanner message={error} />
          </div>
        )}
      </Card>
    </div>
  );
}
