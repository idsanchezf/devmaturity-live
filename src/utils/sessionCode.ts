const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Genera un código corto, legible en voz alta, estilo "DEV-7F2K". */
export function generateSessionCode(): string {
  let suffix = '';
  for (let i = 0; i < 4; i += 1) {
    suffix += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return `DEV-${suffix}`;
}

export function normalizeSessionCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '');
}
