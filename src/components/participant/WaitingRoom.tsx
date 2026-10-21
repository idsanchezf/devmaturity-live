import { Hourglass } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Card } from '@/components/common/Card';

export function WaitingRoom({ participantName }: { participantName: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10 text-center">
      <Logo />
      <Card className="w-full max-w-sm">
        <Hourglass className="mx-auto mb-4 animate-pulse-slow text-accent-400" size={32} />
        <h1 className="mb-1 text-lg font-semibold text-slate-100">¡Listo, {participantName}!</h1>
        <p className="text-sm text-slate-400">
          Esperando a que el presentador inicie la siguiente actividad. Mantén esta pantalla abierta.
        </p>
      </Card>
    </div>
  );
}
