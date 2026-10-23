// ─────────────────────────────────────────────────────────────────────────────
// EducationSection.tsx — "education.md": formación en formato Markdown.
// ─────────────────────────────────────────────────────────────────────────────
import { education, profile } from '../../data/profile';
import { blank, line, tk, type CodeLine } from '../../lib/code';
import { CodeBlock } from '../CodeBlock';
import { EditorWindow } from '../EditorWindow';

// ── Formación: un título "##" y el periodo entre comillas invertidas ──────────
const studyLines: CodeLine[] = education.flatMap((s) => [
  line(0, tk.punct('## '), tk.heading(s.title)),
  line(0, tk.punct('`'), tk.number(`${s.start} — ${s.end ?? 'actualidad'}`), tk.punct('`')),
  blank(),
]);

// ── Idiomas: lista Markdown "- **idioma**: nivel" ────────────────────────────
// Object.entries convierte { español: 'Nativo' } en [['español', 'Nativo']].
const languageLines: CodeLine[] = Object.entries(profile.languages).map(([lang, level]) =>
  line(0, tk.punct('- **'), tk.key(lang[0]!.toUpperCase() + lang.slice(1)), tk.punct('**: '), tk.plain(level)),
);

const LINES: CodeLine[] = [
  line(0, tk.punct('# '), tk.heading('Formación')),
  blank(),
  ...studyLines,
  line(0, tk.punct('# '), tk.heading('Idiomas')),
  blank(),
  ...languageLines,
];

export function EducationSection() {
  return (
    <EditorWindow id="education">
      <CodeBlock lines={LINES} />
    </EditorWindow>
  );
}
