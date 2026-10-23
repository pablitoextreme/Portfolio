// ─────────────────────────────────────────────────────────────────────────────
// ProjectsSection.tsx — "projects.json": proyectos como un JSON válido.
// ─────────────────────────────────────────────────────────────────────────────
// Si copiaras el texto de esta sección y lo pegaras en un validador, sería
// JSON correcto: el serializador usa el estilo 'json' (claves entre comillas,
// sin coma final).
import { otherRepos, projects } from '../../data/profile';
import { serialize } from '../../lib/code';
import { CodeBlock } from '../CodeBlock';
import { EditorWindow } from '../EditorWindow';

// ── Estructura del documento ─────────────────────────────────────────────────
// Reordenamos los campos de cada proyecto para leerlo de arriba abajo:
// nombre → resumen → stack → lo que hice → enlaces.
// (Se llama `projectsJson` y no `document` para no tapar el `document` global.)
const projectsJson = {
  featured: projects.map((p) => ({
    name: p.name,
    summary: p.summary,
    stack: p.stack,
    highlights: p.highlights,
    links: p.links,
  })),
  // Repos sin descripción: solo nombre y URL.
  otherRepos: Object.fromEntries(otherRepos.map((r) => [r.label, r.url])),
};

// JSON no admite comentarios, así que este archivo no lleva cabecera.
const LINES = serialize(projectsJson, 'json');

export function ProjectsSection() {
  return (
    <EditorWindow id="projects">
      <CodeBlock lines={LINES} />
    </EditorWindow>
  );
}
