import { FormEvent, useState } from 'react';
import { Logo } from '@/components/common/Logo';
import { Card } from '@/components/common/Card';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { Lock } from 'lucide-react';
import { setModeratorUnlocked } from '@/lib/auth';

export function ModeratorGate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const expected = import.meta.env.VITE_MODERATOR_PASSPHRASE;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!expected || value === expected) {
      setModeratorUnlocked();
      onUnlock();
      return;
    }
    setError('Passphrase incorrecta.');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <Logo />
      <Card className="w-full max-w-sm">
        <p className="mb-4 flex items-center gap-2 text-sm text-slate-400">
          <Lock size={16} /> Panel de presentador — acceso restringido
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            placeholder="Passphrase"
            className="w-full rounded-xl border border-ink-600 bg-ink-900 px-4 py-3 text-slate-100 outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/30"
          />
          {error && <ErrorBanner message={error} />}
          <button className="tap-highlight-none w-full rounded-xl bg-accent-500 px-4 py-3 font-semibold text-white active:scale-[0.98]">
            Entrar
          </button>
        </form>
      </Card>
    </div>
  );
}
