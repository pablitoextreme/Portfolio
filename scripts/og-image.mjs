// ─────────────────────────────────────────────────────────────────────────────
// og-image.mjs — Genera public/og-image.png a partir de scripts/og-image.html.
// ─────────────────────────────────────────────────────────────────────────────
// Usa Microsoft Edge o Chrome en modo "headless" (sin ventana) para hacer una
// captura del HTML. Así no necesitamos librerías de imagen (sharp, canvas...).
// Uso: npm run og-image   (o define BROWSER=ruta\al\navegador.exe)
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// ── Buscar un navegador basado en Chromium ───────────────────────────────────
const candidates = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const browser = candidates.find((path) => existsSync(path));
if (!browser) {
  throw new Error('No se encontró Edge/Chrome. Indica la ruta con la variable BROWSER.');
}

// ── Rutas ────────────────────────────────────────────────────────────────────
const source = new URL('./og-image.html', import.meta.url).href;
const output = fileURLToPath(new URL('../public/og-image.png', import.meta.url));

// ── Captura ──────────────────────────────────────────────────────────────────
// --window-size fija el tamaño exacto que pide Open Graph (1200×630).
// --hide-scrollbars evita que aparezca una barra de scroll en la imagen.
execFileSync(browser, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--window-size=1200,630',
  `--screenshot=${output}`,
  source,
]);

console.log(`✓ Imagen Open Graph generada: ${output}`);
