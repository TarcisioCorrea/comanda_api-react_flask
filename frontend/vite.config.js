import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // raiz do projeto (frontend)
  build: {
    outDir: 'dist', // pasta de saída do build
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: { // Preview é usado para testar o build final da aplicação, simulando o ambiente de produção.
    port: 4173,
  },
});