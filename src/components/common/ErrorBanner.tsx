import { AlertTriangle } from 'lucide-react';

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-signal-block/30 bg-signal-block/10 p-4 text-sm text-red-200">
      <AlertTriangle className="mt-0.5 shrink-0" size={18} />
      <p>{message}</p>
    </div>
  );
}
