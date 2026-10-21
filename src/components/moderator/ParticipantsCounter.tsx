import { Users } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { ParticipantRow } from '@/types/domain';
import { ROLE_OPTIONS } from '@/data/practices';

export function ParticipantsCounter({ participants }: { participants: ParticipantRow[] }) {
  const byRole = ROLE_OPTIONS.map((opt) => ({
    role: opt.label,
    count: participants.filter((p) => p.role === opt.value).length,
  })).filter((r) => r.count > 0);

  return (
    <Card>
      <p className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent-400">
        <Users size={14} /> Participantes conectados
      </p>
      <p className="mb-3 font-mono text-4xl font-bold text-slate-100">{participants.length}</p>
      {byRole.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {byRole.map((r) => (
            <span key={r.role} className="rounded-full bg-ink-900 px-2.5 py-1 text-xs text-slate-400">
              {r.role} · {r.count}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}
