// ─────────────────────────────────────────────────────────────────────────────
// code.ts — Convierte datos en "líneas de código" coloreadas.
// ─────────────────────────────────────────────────────────────────────────────
// En vez de usar una librería de resaltado de sintaxis (Prism, Shiki...), que
// pesan decenas de KB, generamos nosotros los tokens: como los datos ya son
// objetos de JavaScript, sabemos exactamente qué es una clave, qué es un texto,
// etc. Sin analizar texto ni usar expresiones regulares complejas.

// ── Tipos ────────────────────────────────────────────────────────────────────
/** Categoría de un trozo de código; decide su color (ver CodeBlock.tsx). */
export type TokenKind =
  | 'keyword' // export, const, as...
  | 'type' // nombres de tipos
  | 'key' // claves de objetos
  | 'string' // textos entre comillas
  | 'number' // números, fechas
  | 'punct' // { } [ ] , : "  → decorativo, se oculta a lectores de pantalla
  | 'comment' // // comentarios
  | 'heading' // títulos de Markdown
  | 'link' // texto que es un enlace real (<a>)
  | 'plain'; // texto normal

export type Token = { kind: TokenKind; text: string; href?: string };

/** Una línea = sangría (en niveles) + lista de tokens. */
export type CodeLine = { indent: number; tokens: Token[] };

// ── Atajos para crear tokens ─────────────────────────────────────────────────
// Permiten escribir `tk.key('name')` en lugar de `{ kind: 'key', text: 'name' }`.
export const tk = {
  keyword: (text: string): Token => ({ kind: 'keyword', text }),
  type: (text: string): Token => ({ kind: 'type', text }),
  key: (text: string): Token => ({ kind: 'key', text }),
  string: (text: string): Token => ({ kind: 'string', text }),
  number: (text: string): Token => ({ kind: 'number', text }),
  punct: (text: string): Token => ({ kind: 'punct', text }),
  comment: (text: string): Token => ({ kind: 'comment', text }),
  heading: (text: string): Token => ({ kind: 'heading', text }),
  plain: (text: string): Token => ({ kind: 'plain', text }),
  link: (text: string, href: string): Token => ({ kind: 'link', text, href }),
};

/** Crea una línea. `line(1, a, b)` = línea con 1 nivel de sangría y tokens a, b. */
export const line = (indent: number, ...tokens: Token[]): CodeLine => ({ indent, tokens });

/** Línea vacía (separador visual). */
export const blank = (): CodeLine => ({ indent: 0, tokens: [] });

// ── Serializador: objeto JS → líneas de código ───────────────────────────────
// Funciona como un JSON.stringify "con colores". Dos estilos:
//   · 'ts'   → claves sin comillas (si son identificadores válidos) y coma final.
//   · 'json' → claves con comillas y sin coma tras el último elemento (JSON válido).
export type Style = 'ts' | 'json';

// Identificador válido de JS (admite letras con tilde: `español` es válido).
const IDENTIFIER = /^[\p{L}_$][\p{L}\p{N}_$]*$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Un array de textos cortos se escribe en una sola línea: ["a", "b"].
const INLINE_ARRAY_MAX_CHARS = 60;

/** Token(s) para un valor primitivo. Las URLs y emails se convierten en enlaces. */
function primitive(value: unknown): Token[] {
  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return [tk.number(String(value))];
  }
  const text = String(value);
  // Las comillas van aparte para que el enlace solo cubra el texto útil.
  if (/^https?:\/\//.test(text)) return [tk.punct('"'), tk.link(text, text), tk.punct('"')];
  if (EMAIL.test(text)) return [tk.punct('"'), tk.link(text, `mailto:${text}`), tk.punct('"')];
  // JSON.stringify añade las comillas y escapa las comillas internas.
  return [tk.string(JSON.stringify(text))];
}

function keyToken(key: string, style: Style): Token {
  return tk.key(style === 'ts' && IDENTIFIER.test(key) ? key : JSON.stringify(key));
}

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Convierte `value` en líneas. Es recursiva: los objetos y arrays se llaman a sí
 * misma para cada hijo con un nivel más de sangría.
 * @param prefix tokens antes del valor en la primera línea (p. ej. `clave: `)
 * @param suffix tokens tras el valor en la última línea (p. ej. `,`)
 */
export function serialize(
  value: unknown,
  style: Style,
  indent = 0,
  prefix: Token[] = [],
  suffix: Token[] = [],
): CodeLine[] {
  // Coma tras el elemento i de n: en TS siempre; en JSON, todos menos el último.
  const comma = (i: number, n: number): Token[] =>
    style === 'ts' || i < n - 1 ? [tk.punct(',')] : [];

  // ── Arrays ─────────────────────────────────────────────────────────────────
  if (Array.isArray(value)) {
    const allPrimitive = value.every((v) => typeof v !== 'object' || v === null);
    const length = value.reduce<number>((n, v) => n + String(v).length + 4, 0);

    // Array corto de primitivos → una línea: ["a", "b"]
    if (allPrimitive && length <= INLINE_ARRAY_MAX_CHARS) {
      const items = value.flatMap((v, i) => [
        ...primitive(v),
        ...(i < value.length - 1 ? [tk.punct(', ')] : []),
      ]);
      return [line(indent, ...prefix, tk.punct('['), ...items, tk.punct(']'), ...suffix)];
    }

    // Array largo → un elemento por línea.
    return [
      line(indent, ...prefix, tk.punct('[')),
      ...value.flatMap((v, i) => serialize(v, style, indent + 1, [], comma(i, value.length))),
      line(indent, tk.punct(']'), ...suffix),
    ];
  }

  // ── Objetos ────────────────────────────────────────────────────────────────
  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    return [
      line(indent, ...prefix, tk.punct('{')),
      ...entries.flatMap(([k, v], i) =>
        serialize(v, style, indent + 1, [keyToken(k, style), tk.punct(': ')], comma(i, entries.length)),
      ),
      line(indent, tk.punct('}'), ...suffix),
    ];
  }

  // ── Primitivos ─────────────────────────────────────────────────────────────
  return [line(indent, ...prefix, ...primitive(value), ...suffix)];
}
