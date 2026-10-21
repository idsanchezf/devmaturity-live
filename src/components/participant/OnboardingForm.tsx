import { FormEvent, useState } from 'react';
import { ROLE_OPTIONS } from '@/data/practices';
import { ParticipantRole } from '@/types/domain';
import { Card } from '@/components/common/Card';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { Logo } from '@/components/common/Logo';
import { ArrowRight } from 'lucide-react';

interface OnboardingFormProps {
  sessionCode: string;
  onSubmit: (name: string, role: ParticipantRole) => Promise<void>;
}

export function OnboardingForm({ sessionCode, onSubmit }: OnboardingFormProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<ParticipantRole>('other');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length === 0) {
      setError('Escribe tu nombre o alias para continuar.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(name, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo unir a la sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <Logo />
      <Card className="w-full max-w-sm">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent-400">
          Sesión {sessionCode}
        </p>
        <h1 className="mb-5 text-xl font-semibold text-slate-100">Únete a la evaluación en vivo</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm text-slate-300">
              Nombre o alias
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              autoFocus
              autoComplete="off"
              placeholder="Ej. Ana / @devana"
              className="w-full rounded-xl border border-ink-600 bg-ink-900 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-300">Rol técnico (opcional)</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setRole(opt.value)}
                  className={`tap-highlight-none rounded-lg border px-2 py-2.5 text-xs font-medium transition ${
                    role === opt.value
                      ? 'border-accent-500 bg-accent-500/15 text-accent-300'
                      : 'border-ink-600 bg-ink-900 text-slate-400 active:bg-ink-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          <button
            type="submit"
            disabled={submitting}
            className="tap-highlight-none flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-3.5 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? 'Entrando…' : 'Entrar a la sesión'}
            {!submitting && <ArrowRight size={18} />}
          </button>
        </form>
      </Card>
    </div>
  );
}
