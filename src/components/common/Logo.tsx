import { Radar } from 'lucide-react';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-500/15 text-accent-400 shadow-glow">
        <Radar size={20} strokeWidth={2.25} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <p className="font-mono text-sm font-semibold tracking-tight text-slate-100">
            DevMaturity<span className="text-accent-400">Live</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">live assessment</p>
        </div>
      )}
    </div>
  );
}
