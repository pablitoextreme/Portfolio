// ─────────────────────────────────────────────────────────────────────────────
// SkillsSection.tsx — "skills.ts": habilidades agrupadas por nivel de uso.
// ─────────────────────────────────────────────────────────────────────────────
import { skills } from '../../data/profile';
import { blank, line, serialize, tk } from '../../lib/code';
import { CodeBlock } from '../CodeBlock';
import { EditorWindow } from '../EditorWindow';

// Primero se declara un tipo (como harías en TypeScript real) y después el
// objeto tipado con Record<Nivel, string[]>.
const LINES = [
  line(0, tk.comment('// skills.ts — qué uso y con qué frecuencia')),
  blank(),
  line(
    0,
    tk.keyword('type '),
    tk.type('Nivel'),
    tk.punct(' = '),
    tk.string('"a diario"'),
    tk.punct(' | '),
    tk.string('"con base"'),
    tk.punct(' | '),
    tk.string('"aprendiendo"'),
    tk.punct(';'),
  ),
  blank(),
  ...serialize(
    skills,
    'ts',
    0,
    [
      tk.keyword('export const '),
      tk.plain('skills'),
      tk.punct(': '),
      tk.type('Record'),
      tk.punct('<'),
      tk.type('Nivel'),
      tk.punct(', '),
      tk.type('string'),
      tk.punct('[]> = '),
    ],
    [tk.punct(';')],
  ),
];

export function SkillsSection() {
  return (
    <EditorWindow id="skills">
      <CodeBlock lines={LINES} />
    </EditorWindow>
  );
}
