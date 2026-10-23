# Portfolio · Pablo García García

Portfolio personal con estética de terminal/editor de código.
React + TypeScript + Vite + Tailwind CSS, sin más dependencias.

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # servidor de desarrollo
npm run build      # comprobar tipos + compilar + pre-renderizar → dist/
npm run preview    # servir dist/ en local
npm run og-image   # regenerar public/og-image.png (necesita Edge o Chrome)
```

## Dónde cambiar cosas

| Qué | Archivo |
|---|---|
| Datos (bio, experiencia, proyectos, habilidades...) | `src/data/profile.ts` |
| URL pública (necesaria para la vista previa de LinkedIn) | `src/data/site.ts` |
| Pestañas / orden de secciones | `src/data/sections.ts` |
| Colores y tipografía | `src/styles/index.css` (`@theme`) |
| Imagen al compartir en redes | `scripts/og-image.html` → `npm run og-image` |

## Publicar

`npm run build` genera `dist/`, una web estática que se puede subir a GitHub Pages, Vercel o Netlify.
Antes de publicar, pon la URL definitiva en `src/data/site.ts`.
