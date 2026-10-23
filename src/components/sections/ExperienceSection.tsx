// ─────────────────────────────────────────────────────────────────────────────
// ExperienceSection.tsx — "experience.log": experiencia como un archivo de log.
// ─────────────────────────────────────────────────────────────────────────────
// Formato de cada puesto:
//   [2026-07 → actualidad] INFO Técnico Informático @ Building Center/Caixabank
//       ├─ tarea 1
//       └─ última tarea
import { experience, type Job } from '../../data/profile';
import { blank, line, tk, type CodeLine } from '../../lib/code';
import { CodeBlock } from '../CodeBlock';
import { EditorWindow } from '../EditorWindow';

// ── Un puesto → varias líneas ────────────────────────────────────────────────
function jobLines(job: Job): CodeLine[] {
  const period = `${job.start} → ${job.end ?? 'actualidad'}`;
  return [
    // Cabecera: fecha, nivel "INFO" (o "LIVE" si es el puesto actual) y puesto.
    line(
      0,
      tk.punct('['),
      tk.number(period),
      tk.punct('] '),
      tk.keyword(job.end === null ? 'LIVE ' : 'INFO '),
      tk.heading(job.role),
      tk.plain(' @ '),
      tk.string(job.company),
    ),
    // Tareas con caracteres de árbol: ├─ para todas menos la última (└─).
    ...job.tasks.map((task, i) =>
      line(2, tk.punct(i === job.tasks.length - 1 ? '└─ ' : '├─ '), tk.plain(task)),
    ),
  ];
}

const LINES: CodeLine[] = [
  line(0, tk.comment('# experience.log — del puesto más reciente al más antiguo')),
  blank(),
  // flatMap: cada puesto da varias líneas + una línea en blanco de separación.
  ...experience.flatMap((job) => [...jobLines(job), blank()]),
  line(0, tk.comment('# EOF')),
];

export function ExperienceSection() {
  return (
    <EditorWindow id="experience">
      <CodeBlock lines={LINES} />
    </EditorWindow>
  );
}
