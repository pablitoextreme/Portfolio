// ─────────────────────────────────────────────────────────────────────────────
// site.ts — Configuración de publicación.
// ─────────────────────────────────────────────────────────────────────────────
// ⚠️ CAMBIA ESTA URL cuando sepas dónde vas a publicar la web.
// Open Graph (la vista previa de LinkedIn) exige URLs ABSOLUTAS, por eso se
// necesita aquí. Debe terminar en "/".
//   · GitHub Pages en un repo "Portfolio": https://pablitoextreme.github.io/Portfolio/
//     (la ruta respeta mayúsculas: debe coincidir con el nombre exacto del repo)
//   · Vercel / dominio propio:             https://tu-dominio.com/
export const SITE = {
  url: 'https://pablitoextreme.github.io/Portfolio/',
  locale: 'es_ES',
} as const;
