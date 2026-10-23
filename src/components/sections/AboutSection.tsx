// ─────────────────────────────────────────────────────────────────────────────
// AboutSection.tsx — "about.ts": quién soy, escrito como un objeto TypeScript.
// ─────────────────────────────────────────────────────────────────────────────
import { profile } from '../../data/profile';
import { blank, line, serialize, tk } from '../../lib/code';
import { CodeBlock } from '../CodeBlock';
import { EditorWindow } from '../EditorWindow';

// ── Construcción de las líneas ───────────────────────────────────────────────
// Se calcula una sola vez al cargar el módulo (los datos no cambian), no en
// cada render. Elegimos qué campos mostrar y en qué orden.
const about = {
  name: profile.name,
  role: profile.title,
  location: profile.location,
  bio: profile.bio,
  languages: profile.languages,
  strengths: profile.strengths,
};

const LINES = [
  line(0, tk.comment('// about.ts — quién soy')),
  blank(),
  // `serialize` genera:  export const about = { ...todos los campos... } as const;
  ...serialize(
    about,
    'ts',
    0,
    [tk.keyword('export const '), tk.plain('about'), tk.punct(' = ')],
    [tk.keyword(' as const'), tk.punct(';')],
  ),
];

export function AboutSection() {
  return (
    <EditorWindow id="about">
      <CodeBlock lines={LINES} />
    </EditorWindow>
  );
}
