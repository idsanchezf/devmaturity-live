import { QRCodeSVG } from 'qrcode.react';
import { Card } from '@/components/common/Card';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function QRPanel({ sessionCode }: { sessionCode: string }) {
  const [copied, setCopied] = useState(false);
  const joinUrl = `${window.location.origin}${import.meta.env.BASE_URL}?session=${sessionCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API puede fallar en contextos no seguros; el link sigue visible.
    }
  };

  return (
    <Card className="flex flex-col items-center text-center">
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent-400">Únete escaneando</p>
      <div className="rounded-xl bg-white p-3">
        <QRCodeSVG value={joinUrl} size={176} />
      </div>
      <p className="mt-4 font-mono text-2xl font-bold tracking-[0.2em] text-slate-100">{sessionCode}</p>
      <button
        onClick={handleCopy}
        className="tap-highlight-none mt-3 flex items-center gap-1.5 rounded-lg border border-ink-600 px-3 py-1.5 text-xs text-slate-400 transition active:scale-95"
      >
        {copied ? <Check size={14} className="text-signal-ok" /> : <Copy size={14} />}
        {copied ? 'Copiado' : 'Copiar link'}
      </button>
    </Card>
  );
}
