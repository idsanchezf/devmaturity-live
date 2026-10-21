import { Loader2 } from 'lucide-react';

export function LoadingScreen({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="animate-spin text-accent-400" size={28} />
      <p className="font-mono text-sm">{label}</p>
    </div>
  );
}
