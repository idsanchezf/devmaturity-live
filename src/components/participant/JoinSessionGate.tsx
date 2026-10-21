import { FormEvent, useState } from 'react';
import { Logo } from '@/components/common/Logo';
import { Card } from '@/components/common/Card';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { ArrowRight } from 'lucide-react';

export function JoinSessionGate({ onResolve }: { onResolve: (code: string) => void }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim().length === 0) return;
    onResolve(value);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <Logo />
      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-semibold text-slate-100">Ingresa el código de sesión</h1>
        <p className="mb-5 text-sm text-slate-400">Lo verás proyectado por el presentador, ej. DEV-7F2K.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            placeholder="DEV-XXXX"
            autoFocus
            maxLength={16}
            className="w-full rounded-xl border border-ink-600 bg-ink-900 px-4 py-3 text-center font-mono text-lg tracking-widest text-slate-100 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30"
          />
          <button
            type="submit"
            className="tap-highlight-none flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-3.5 font-semibold text-white transition active:scale-[0.98]"
          >
            Continuar <ArrowRight size={18} />
          </button>
        </form>
      </Card>
    </div>
  );
}

export function SessionNotFound({ code }: { code: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <Logo />
      <Card className="w-full max-w-sm text-center">
        <ErrorBanner message={`No encontramos la sesión "${code}". Verifica el código con el presentador.`} />
      </Card>
    </div>
  );
}
