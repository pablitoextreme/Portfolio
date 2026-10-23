// ─────────────────────────────────────────────────────────────────────────────
// vite.config.ts — Configuración de Vite (servidor de desarrollo y compilación).
// ─────────────────────────────────────────────────────────────────────────────
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { SITE } from './src/data/site';
import { buildHead } from './src/seo';

// ── Plugin propio: inyecta las etiquetas SEO / Open Graph en index.html ──────
// index.html tiene un comentario <!--app-head--> que sustituimos por las
// etiquetas generadas a partir de los datos (src/seo.ts). Así título,
// descripción y URL salen de UNA sola fuente y nunca se desincronizan.
// `transformIndexHtml` se ejecuta tanto en `npm run dev` como en `npm run build`.
function seoHead(): Plugin {
  return {
    name: 'seo-head',
    transformIndexHtml(html) {
      return html.replace('<!--app-head-->', buildHead());
    },
  };
}

export default defineConfig({
  // ── base: la ruta donde se publicará la web ────────────────────────────────
  // Se calcula a partir de la URL pública (src/data/site.ts). Si la URL es
  // https://usuario.github.io/portfolio/, la base es "/portfolio/" y Vite
  // antepone ese prefijo a todos los recursos (JS, CSS, favicon...).
  base: new URL(SITE.url).pathname,

  // react(): JSX + Fast Refresh en desarrollo.
  // tailwindcss(): Tailwind v4 se integra como plugin; no hace falta PostCSS.
  plugins: [react(), tailwindcss(), seoHead()],
});
