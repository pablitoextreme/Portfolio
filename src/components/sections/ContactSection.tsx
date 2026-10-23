// ─────────────────────────────────────────────────────────────────────────────
// ContactSection.tsx — "contact.md": formas de contacto en Markdown.
// ─────────────────────────────────────────────────────────────────────────────
import { profile } from '../../data/profile';
import { blank, line, tk, type CodeLine } from '../../lib/code';
import { CodeBlock } from '../CodeBlock';
import { EditorWindow } from '../EditorWindow';

// ── Una línea de lista con enlace Markdown: - **Etiqueta:** [texto](url) ──────
// Visualmente imita la sintaxis Markdown, pero el texto es un <a> real.
function contactLine(label: string, text: string, href: string): CodeLine {
  return line(
    0,
    tk.punct('- **'),
    tk.key(label),
    tk.punct(':** ['),
    tk.link(text, href),
    tk.punct(`](${href.replace(/^mailto:/, '')})`),
  );
}

// Para el texto visible quitamos "https://www." y la barra final: más limpio.
const pretty = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const LINES: CodeLine[] = [
  line(0, tk.punct('# '), tk.heading('Contacto')),
  blank(),
  line(0, tk.plain('¿Hablamos? Escríbeme o echa un vistazo a mi código.')),
  blank(),
  contactLine('Email', profile.email, `mailto:${profile.email}`),
  contactLine('GitHub', pretty(profile.links.github), profile.links.github),
  contactLine('LinkedIn', pretty(profile.links.linkedin), profile.links.linkedin),
  blank(),
  line(0, tk.punct('> '), tk.comment(`📍 ${profile.location}`)),
];

export function ContactSection() {
  return (
    <EditorWindow id="contact">
      <CodeBlock lines={LINES} />
    </EditorWindow>
  );
}
