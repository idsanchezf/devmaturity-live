import { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-ink-600 bg-ink-800/80 p-5 shadow-xl shadow-black/20 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}
