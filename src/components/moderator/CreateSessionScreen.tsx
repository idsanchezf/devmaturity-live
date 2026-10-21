import { useState } from 'react';
import { Logo } from '@/components/common/Logo';
import { Card } from '@/components/common/Card';
import { ErrorBanner } from '@/components/common/ErrorBanner';
import { Plus } from 'lucide-react';

export function CreateSessionScreen({ onCreate }: { onCreate: () => Promise<void> }) {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setCreating(true);
    setError(null);
    try {
      await onCreate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la sesión.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <Logo />
      <Card className="w-full max-w-sm text-center">
        <h1 className="mb-2 text-lg font-semibold text-slate-100">Panel de presentador</h1>
        <p className="mb-5 text-sm text-slate-400">Crea una nueva sesión en vivo para empezar.</p>
        {error && (
          <div className="mb-4">
            <ErrorBanner message={error} />
          </div>
        )}
        <button
          onClick={handleCreate}
          disabled={creating}
          className="tap-highlight-none flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-3.5 font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
        >
          <Plus size={18} /> {creating ? 'Creando…' : 'Nueva sesión'}
        </button>
      </Card>
    </div>
  );
}
