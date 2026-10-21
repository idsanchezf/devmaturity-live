import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages sirve el sitio en https://<usuario>.github.io/<repo>/
// VITE_BASE_PATH permite overridear el base (ej. en Actions: /devmaturity-live/).
// Usamos HashRouter en la app, así que el base path solo afecta assets e index.html,
// nunca rutas del cliente -> cero 404 al recargar subrutas en GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/devmaturity-live/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
