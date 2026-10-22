import { useMemo, useState } from 'react';
import { TRACKS } from '@/data/practices';
import { AssessmentResponseRow, MaturityLevel, PracticeKey, TrackType } from '@/types/domain';
import { PracticeCard } from './PracticeCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ErrorBanner } from '@/components/common/ErrorBanner';

interface AssessmentCarouselProps {
  initialResponses: AssessmentResponseRow[];
  track: TrackType;
  onAnswer: (practiceKey: PracticeKey, level: MaturityLevel) => Promise<void>;
  onFinish: () => void;
}

export function AssessmentCarousel({ initialResponses, track, onAnswer, onFinish }: AssessmentCarouselProps) {
  const practices = TRACKS[track].practices;

  const initialMap = useMemo(() => {
    const map: Partial<Record<PracticeKey, MaturityLevel>> = {};
    initialResponses.forEach((r) => {
      map[r.practice_key] = r.level;
    });
    return map;
  }, [initialResponses]);

  const [answers, setAnswers] = useState<Partial<Record<PracticeKey, MaturityLevel>>>(initialMap);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const practice = practices[index];
  const answeredCount = Object.keys(answers).length;
  const isLast = index === practices.length - 1;

  const handleSelect = async (level: MaturityLevel) => {
    setSaving(true);
    setError(null);
    try {
      await onAnswer(practice.key, level);
      setAnswers((prev) => ({ ...prev, [practice.key]: level }));
      setTimeout(() => {
        if (isLast) {
          onFinish();
        } else {
          setIndex((i) => Math.min(i + 1, practices.length - 1));
        }
      }, 220);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar tu respuesta.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-md flex-1">
        <div className="mb-5 flex items-center gap-2">
          {practices.map((p, i) => (
            <div
              key={p.key}
              className={`h-1.5 flex-1 rounded-full transition ${
                answers[p.key] ? 'bg-accent-500' : i === index ? 'bg-slate-500' : 'bg-ink-700'
              }`}
            />
          ))}
        </div>

        <div className="rounded-2xl border border-ink-600 bg-ink-800/80 p-5 shadow-xl shadow-black/20">
          <PracticeCard
            practice={practice}
            index={index}
            total={practices.length}
            selected={answers[practice.key] ?? null}
            onSelect={handleSelect}
          />
        </div>

        {error && (
          <div className="mt-4">
            <ErrorBanner message={error} />
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <button
            disabled={index === 0 || saving}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="tap-highlight-none flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-400 disabled:opacity-30"
          >
            <ChevronLeft size={18} /> Anterior
          </button>
          <p className="font-mono text-xs text-slate-500">
            {answeredCount}/{practices.length} respondidas
          </p>
          <button
            disabled={isLast || saving}
            onClick={() => setIndex((i) => Math.min(practices.length - 1, i + 1))}
            className="tap-highlight-none flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-400 disabled:opacity-30"
          >
            Siguiente <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
