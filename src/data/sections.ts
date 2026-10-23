// ─────────────────────────────────────────────────────────────────────────────
// sections.ts — Lista de secciones (las "pestañas" del editor).
// ─────────────────────────────────────────────────────────────────────────────
// La usan la barra de pestañas (SiteHeader) y cada ventana (EditorWindow).
// Para reordenar o renombrar una pestaña, se cambia solo aquí.

export type Section = {
  /** id del elemento HTML; también es el ancla de la URL (#about). */
  id: string;
  /** Nombre de archivo que se ve en la pestaña. */
  file: string;
  /** Nombre "humano" para lectores de pantalla y buscadores. */
  title: string;
  /** Lenguaje que aparece en la barra de estado de la ventana. */
  language: string;
  /** Color del icono de la pestaña (clase de Tailwind). */
  dot: string;
};

export const SECTIONS = [
  { id: 'about', file: 'about.ts', title: 'Sobre mí', language: 'TypeScript', dot: 'bg-keyword' },
  { id: 'experience', file: 'experience.log', title: 'Experiencia', language: 'Log', dot: 'bg-number' },
  { id: 'projects', file: 'projects.json', title: 'Proyectos', language: 'JSON', dot: 'bg-string' },
  { id: 'skills', file: 'skills.ts', title: 'Habilidades', language: 'TypeScript', dot: 'bg-keyword' },
  { id: 'education', file: 'education.md', title: 'Formación', language: 'Markdown', dot: 'bg-accent' },
  { id: 'contact', file: 'contact.md', title: 'Contacto', language: 'Markdown', dot: 'bg-accent' },
] as const satisfies readonly Section[];

export type SectionId = (typeof SECTIONS)[number]['id'];

/** Ids en orden, para el scrollspy. Constante fuera de componentes = referencia estable. */
export const SECTION_IDS: readonly string[] = SECTIONS.map((s) => s.id);

/** Busca los metadatos de una sección por su id. */
export function getSection(id: SectionId): Section {
  // `!` es seguro: el tipo SectionId solo admite ids que existen en la lista.
  return SECTIONS.find((s) => s.id === id)!;
}
