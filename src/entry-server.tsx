// ─────────────────────────────────────────────────────────────────────────────
// entry-server.tsx — Punto de entrada para el PRE-RENDERIZADO (Node.js).
// ─────────────────────────────────────────────────────────────────────────────
// Vite lo compila aparte (`vite build --ssr`) y scripts/prerender.mjs llama a
// render() para obtener el HTML de la página como texto. Ese HTML se guarda en
// dist/index.html: la web se ve completa aunque el navegador no ejecute JS.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';

export function render(): string {
  // Mismo árbol que en main.tsx para que la hidratación coincida.
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
