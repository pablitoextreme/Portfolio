// ─────────────────────────────────────────────────────────────────────────────
// seo.ts — Genera las etiquetas <head> para buscadores y redes sociales.
// ─────────────────────────────────────────────────────────────────────────────
// Lo usa el plugin "seo-head" de vite.config.ts. Devuelve un string de HTML
// que se inserta en index.html al servir/compilar (no se ejecuta en el navegador).
import { profile } from './data/profile';
import { SITE } from './data/site';

// ── Escapado ─────────────────────────────────────────────────────────────────
// Los textos van dentro de atributos HTML (content="..."). Escapamos los
// caracteres especiales para que una comilla o un "<" no rompan el HTML.
function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildHead(): string {
  // ── Textos ─────────────────────────────────────────────────────────────────
  // El título es lo que se ve en la pestaña y en la vista previa de LinkedIn.
  // La descripción conviene que no pase de unos 160 caracteres (Google la corta).
  const title = `${profile.name} · ${profile.title}`;
  const description =
    'Desarrollador Backend Junior: Java, Spring Boot, PostgreSQL, Docker y Kubernetes. ' +
    'APIs REST, microservicios, mensajería con RabbitMQ y CI/CD con GitHub Actions.';

  // ── URLs absolutas ─────────────────────────────────────────────────────────
  // `new URL(relativa, base)` construye la URL completa a partir de site.ts.
  const url = SITE.url;
  const image = new URL('og-image.png', SITE.url).href;

  // ── Datos estructurados (JSON-LD, schema.org/Person) ───────────────────────
  // Google los usa para entender que la página describe a una persona y qué
  // perfiles son suyos (sameAs). Reemplazamos "<" para que el JSON no pueda
  // cerrar la etiqueta <script> por accidente.
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.title,
    url,
    email: `mailto:${profile.email}`,
    address: { '@type': 'PostalAddress', addressLocality: profile.location, addressCountry: 'ES' },
    sameAs: [profile.links.github, profile.links.linkedin],
  }).replace(/</g, '\\u003c');

  // ── Etiquetas ──────────────────────────────────────────────────────────────
  // · Básicas: title, description, canonical (URL "oficial" de la página).
  // · Open Graph (og:*): la usan LinkedIn, WhatsApp, Facebook... La imagen debe
  //   ser PNG/JPG de 1200×630; LinkedIn no admite SVG.
  // · Twitter Card: equivalente para X/Twitter.
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="author" content="${esc(profile.name)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,

    `<meta property="og:type" content="profile" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:site_name" content="${esc(profile.name)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(`${profile.name}, ${profile.title}`)}" />`,
    `<meta property="profile:first_name" content="${esc(profile.firstName)}" />`,

    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,

    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ');
}
