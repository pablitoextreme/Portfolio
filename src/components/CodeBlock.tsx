// ─────────────────────────────────────────────────────────────────────────────
// CodeBlock.tsx — Pinta líneas de código con números de línea y colores.
// ─────────────────────────────────────────────────────────────────────────────
import type { CSSProperties } from 'react';
import type { CodeLine, Token, TokenKind } from '../lib/code';

// ── Colores por tipo de token ────────────────────────────────────────────────
// Las clases usan los colores definidos en src/styles/index.css (@theme).
// Todos tienen contraste AA (≥ 4.5:1) sobre el fondo del editor.
const COLOR: Record<TokenKind, string> = {
  keyword: 'text-keyword',
  type: 'text-keyword',
  key: 'text-accent',
  string: 'text-string',
  number: 'text-number',
  punct: 'text-punct',
  comment: 'text-muted italic',
  heading: 'text-accent font-bold',
  link: 'text-string underline decoration-dotted underline-offset-4 hover:decoration-solid',
  plain: 'text-fg',
};

// ── Un token ─────────────────────────────────────────────────────────────────
function TokenView({ token }: { token: Token }) {
  const className = COLOR[token.kind];

  // Los enlaces son <a> reales: se pueden enfocar con Tab y abrir con Enter.
  if (token.kind === 'link' && token.href) {
    return (
      <a href={token.href} className={className}>
        {token.text}
      </a>
    );
  }

  // La puntuación ({ } " , :) es decorativa: con aria-hidden el lector de
  // pantalla lee "name Pablo García García" en vez de "llave, name, dos puntos...".
  if (token.kind === 'punct') {
    return (
      <span aria-hidden="true" className={className}>
        {token.text}
      </span>
    );
  }

  return <span className={className}>{token.text}</span>;
}

// ── El bloque completo ───────────────────────────────────────────────────────
export function CodeBlock({ lines }: { lines: CodeLine[] }) {
  return (
    <div className="py-4 text-[0.8125rem] leading-6 sm:text-sm">
      {lines.map((line, i) => (
        // Cada línea es una rejilla de 2 columnas: número | contenido.
        // `--i` (índice) lo usa el CSS para que las líneas aparezcan escalonadas
        // al hacer scroll (ver .code-line en index.css).
        <div
          key={i}
          className="code-line grid grid-cols-[2.5ch_1fr] gap-3 pr-4 hover:bg-white/[0.03] sm:grid-cols-[3ch_1fr] sm:gap-5"
          style={{ '--i': i } as CSSProperties}
        >
          {/* Número de línea: decorativo, no seleccionable y oculto a lectores. */}
          <span aria-hidden="true" className="select-none text-right text-punct">
            {i + 1}
          </span>

          {/* Contenido. La sangría se aplica con padding (en "ch" = ancho de un
              carácter monoespaciado) para que, si una línea larga se parte en el
              móvil, la continuación quede alineada y no vuelva a la columna 0.
              pre-wrap respeta espacios pero permite saltar de línea;
              overflow-wrap:anywhere parte URLs largas para evitar scroll horizontal. */}
          <span
            className="min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]"
            style={{ paddingLeft: `${line.indent * 2}ch` }}
          >
            {line.tokens.map((token, j) => (
              <TokenView key={j} token={token} />
            ))}
            {/* Una línea vacía necesita algo dentro para tener altura. */}
            {line.tokens.length === 0 && ' '}
          </span>
        </div>
      ))}
    </div>
  );
}
