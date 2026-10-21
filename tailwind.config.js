/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05070f',
          900: '#0a0e1a',
          800: '#111627',
          700: '#1b2236',
          600: '#272f48',
        },
        accent: {
          400: '#60a5fa',
          500: '#4f6df5',
          600: '#4338ca',
        },
        signal: {
          ok: '#22c55e',
          warn: '#f59e0b',
          block: '#ef4444',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(79,109,245,0.35), 0 8px 30px rgba(79,109,245,0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
