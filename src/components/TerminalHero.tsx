// ─────────────────────────────────────────────────────────────────────────────
// TerminalHero.tsx — Portada con aspecto de terminal y efecto de escritura.
// ─────────────────────────────────────────────────────────────────────────────
import { profile } from '../data/profile';
import { useTypewriter, type TerminalLine } from '../hooks/useTypewriter';

// ── Guion de la terminal ─────────────────────────────────────────────────────
// Definido FUERA del componente: así es el mismo array en cada render y los
// useMemo/useEffect del hook no se reinician sin motivo.
const LINES: readonly TerminalLine[] = [
  { kind: 'command', text: 'whoami' },
  { kind: 'output', text: profile.name },
  { kind: 'command', text: 'cat rol.txt' },
  { kind: 'output', text: profile.title },
  { kind: 'command', text: 'cat stack.txt' },
  { kind: 'output', text: 'Java · Spring Boot · PostgreSQL · Docker · Kubernetes' },
  { kind: 'command', text: 'cat ubicacion.txt' },
  { kind: 'output', text: profile.location },
];

// Índice de la línea con el nombre: se marca como <h1> (título principal).
const NAME_LINE = 1;

// ── Prompt "pablo@portfolio:~$" ──────────────────────────────────────────────
// Decorativo: aria-hidden para que el lector no lo repita en cada línea.
function Prompt() {
  return (
    <span aria-hidden="true" className="select-none">
      <span className="text-accent">pablo@portfolio</span>
      <span className="text-muted">:</span>
      <span className="text-keyword">~</span>
      <span className="text-muted">$ </span>
    </span>
  );
}

// ── Cursor parpadeante ───────────────────────────────────────────────────────
// La clase "cursor" solo parpadea si no se pide movimiento reducido (CSS).
function Cursor() {
  return <span aria-hidden="true" className="cursor ml-px inline-block h-[1.1em] w-[0.6em] translate-y-[0.15em] bg-accent" />;
}

// ── Texto de una línea durante la animación ──────────────────────────────────
// Truco para no mover el diseño (sin "saltos" de layout): pintamos la parte ya
// escrita y la parte pendiente con `invisible` (ocupa espacio pero no se ve).
// Los lectores de pantalla reciben siempre el texto completo vía sr-only.
function TypedText({ text, shown, cursor }: { text: string; shown: number; cursor: boolean }) {
  return (
    <>
      <span aria-hidden="true">
        {text.slice(0, shown)}
        {cursor && <Cursor />}
        <span className="invisible">{text.slice(shown)}</span>
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}

export function TerminalHero() {
  const { running, skip, visibleChars, cursorLine } = useTypewriter(LINES);

  return (
    <section
      aria-label="Presentación"
      className="flex min-h-[calc(100svh-3.25rem)] flex-col justify-center gap-8 py-12"
    >
      {/* ── Ventana de terminal ───────────────────────────────────────────── */}
      {/* Un clic dentro también salta la animación (atajo cómodo en móvil). */}
      <div
        onClick={running ? skip : undefined}
        className="overflow-hidden rounded-lg border border-line bg-panel shadow-[0_0_80px_-20px_rgba(74,222,128,0.35)]"
      >
        {/* Barra de título: los tres "botones" de ventana son decorativos.
            El botón "Saltar" vive aquí, en un hueco de altura fija, para que su
            aparición no desplace el contenido. */}
        <div className="flex h-10 items-center gap-2 border-b border-line bg-black/60 px-4">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-3 rounded-full bg-[#ff5f57]/80" />
            <span className="size-3 rounded-full bg-[#febc2e]/80" />
            <span className="size-3 rounded-full bg-[#28c840]/80" />
          </span>
          <span className="ml-2 truncate text-xs text-muted">pablo@portfolio: ~</span>
          {running && (
            <button
              type="button"
              onClick={skip}
              className="ml-auto shrink-0 rounded border border-line px-2 py-0.5 text-xs text-fg hover:border-accent hover:text-accent"
            >
              Saltar <kbd className="text-muted">Esc</kbd>
            </button>
          )}
        </div>

        {/* ── Líneas ──────────────────────────────────────────────────────── */}
        {/* data-typewriter: el CSS lo oculta mientras <html> tiene la clase
            "typing-pending" (justo antes de que empiece a escribirse). */}
        <div data-typewriter className="space-y-1 p-5 text-sm leading-7 sm:p-8 sm:text-base">
          {LINES.map((l, i) => {
            const shown = visibleChars[i] ?? l.text.length;
            const text = running ? (
              <TypedText text={l.text} shown={shown} cursor={cursorLine === i} />
            ) : (
              l.text
            );

            // Líneas a las que la animación aún no ha llegado: ocupan su sitio
            // (sin saltos de diseño) pero no se ven. Usamos opacity-0 y no
            // `invisible` porque visibility:hidden también las ocultaría al
            // lector de pantalla, que debe recibir todo el texto desde el inicio.
            const pending = running && shown === 0 && cursorLine !== i ? 'opacity-0' : '';

            if (l.kind === 'command') {
              return (
                <p key={i} className={`text-fg ${pending}`}>
                  <Prompt />
                  {text}
                </p>
              );
            }

            // La salida con el nombre es el <h1> de la página: grande y en verde.
            if (i === NAME_LINE) {
              return (
                <h1
                  key={i}
                  className={`text-2xl font-bold text-accent sm:text-4xl [text-shadow:0_0_18px_rgba(74,222,128,0.45)] ${pending}`}
                >
                  {text}
                </h1>
              );
            }
            return (
              <p key={i} className={`text-string ${pending}`}>
                {text}
              </p>
            );
          })}

          {/* Prompt final vacío con el cursor esperando: solo aparece al terminar. */}
          <p className={`text-fg ${running ? 'opacity-0' : ''}`}>
            <Prompt />
            {!running && <Cursor />}
          </p>
        </div>
      </div>

      {/* ── Accesos directos ──────────────────────────────────────────────── */}
      {/* Enlaces normales (<a>): funcionan sin JS y con teclado. */}
      <nav aria-label="Enlaces principales" className="flex flex-wrap gap-3 text-sm">
        <a href="#projects" className="rounded border border-accent bg-accent px-4 py-2 font-bold text-black hover:bg-transparent hover:text-accent">
          ./ver-proyectos
        </a>
        <a href={profile.links.github} className="rounded border border-line px-4 py-2 text-fg hover:border-accent hover:text-accent">
          github
        </a>
        <a href={profile.links.linkedin} className="rounded border border-line px-4 py-2 text-fg hover:border-accent hover:text-accent">
          linkedin
        </a>
        <a href={`mailto:${profile.email}`} className="rounded border border-line px-4 py-2 text-fg hover:border-accent hover:text-accent">
          email
        </a>
      </nav>

      {/* ── Indicación de scroll ──────────────────────────────────────────── */}
      <a href="#about" className="scroll-hint self-start text-sm text-muted hover:text-accent">
        <span aria-hidden="true">↓ </span>desplázate para ver más
      </a>
    </section>
  );
}
