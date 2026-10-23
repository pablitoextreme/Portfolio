// ─────────────────────────────────────────────────────────────────────────────
// prerender.mjs — Último paso de `npm run build`.
// ─────────────────────────────────────────────────────────────────────────────
// 1. Importa el render() compilado en dist-ssr/ (entry-server.tsx).
// 2. Lo ejecuta para obtener el HTML de toda la página.
// 3. Lo mete dentro de <div id="root"> en dist/index.html.
// 4. Borra dist-ssr/, que ya no hace falta.
// Es "generación estática" (SSG) hecha a mano en ~20 líneas, sin librerías.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Rutas relativas a la carpeta del proyecto (no a donde se ejecute el comando).
const root = new URL('../', import.meta.url);
const htmlPath = fileURLToPath(new URL('dist/index.html', root));
const ssrDir = fileURLToPath(new URL('dist-ssr/', root));
const ssrEntry = new URL('dist-ssr/entry-server.js', root).href;

const { render } = await import(ssrEntry);
const template = await readFile(htmlPath, 'utf8');

// Comprobación: si el marcador no está, algo ha cambiado en index.html y es
// mejor fallar con un mensaje claro que publicar una página vacía.
if (!template.includes('<!--app-html-->')) {
  throw new Error('No se encontró <!--app-html--> en dist/index.html');
}

await writeFile(htmlPath, template.replace('<!--app-html-->', render()));
await rm(ssrDir, { recursive: true, force: true });

console.log('✓ Pre-renderizado completado: dist/index.html');
