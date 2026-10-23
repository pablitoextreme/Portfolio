// ─────────────────────────────────────────────────────────────────────────────
// main.tsx — Punto de entrada en el NAVEGADOR.
// ─────────────────────────────────────────────────────────────────────────────
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

const container = document.getElementById('root')!;
const app = (
  // StrictMode: en desarrollo ejecuta comprobaciones extra (efectos dobles,
  // APIs obsoletas). En producción no hace nada.
  <StrictMode>
    <App />
  </StrictMode>
);

// ── ¿Hidratar o renderizar? ──────────────────────────────────────────────────
// · En producción el HTML ya viene pre-renderizado (scripts/prerender.mjs):
//   "hidratamos", es decir, React reutiliza ese HTML y solo le engancha los
//   eventos. Es más rápido que volver a crearlo y no hay parpadeo.
// · En desarrollo (`npm run dev`) #root solo contiene un comentario, así que
//   renderizamos desde cero.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
