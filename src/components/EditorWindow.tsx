// ─────────────────────────────────────────────────────────────────────────────
// EditorWindow.tsx — Ventana tipo editor de código que envuelve cada sección.
// ─────────────────────────────────────────────────────────────────────────────
// Aporta: <section> semántica con su título, la pestaña con el nombre de
// archivo, la barra de estado inferior y la animación de aparición al hacer scroll.
import type { ReactNode } from 'react';
import { getSection, type SectionId } from '../data/sections';
import { useReveal } from '../hooks/useReveal';

type Props = {
  id: SectionId;
  children: ReactNode;
};

export function EditorWindow({ id, children }: Props) {
  const section = getSection(id);
  const { ref, visible } = useReveal<HTMLElement>();
  const headingId = `${id}-title`;

  return (
    // ── Contenedor ───────────────────────────────────────────────────────────
    // · id → destino de los enlaces de la barra de pestañas (#about...).
    // · aria-labelledby → el lector de pantalla anuncia "Sobre mí, región".
    // · "reveal" + "is-visible" → el CSS anima la entrada (ver index.css).
    //   Sin JavaScript nunca se oculta, porque la regla depende de la clase
    //   "reveal-ready" que solo añade React.
    // · El desplazamiento de la animación se aplica al div interior
    //   (.reveal-body), no a la <section>: así el destino del ancla #about no
    //   se mueve y, al pulsar una pestaña, la ventana queda justo bajo la barra.
    <section
      id={id}
      ref={ref}
      aria-labelledby={headingId}
      className={`reveal ${visible ? 'is-visible' : ''}`}
    >
      <div className="reveal-body overflow-hidden rounded-lg border border-line bg-panel shadow-[0_0_0_1px_rgba(74,222,128,0.04),0_20px_60px_-30px_rgba(74,222,128,0.25)]">
      {/* ── Barra superior con la pestaña del archivo ─────────────────────── */}
      <div className="flex items-end border-b border-line bg-black/60 pl-2">
        <h2
          id={headingId}
          className="flex items-center gap-2 border-x border-t border-line border-t-accent bg-panel px-4 py-2 text-sm text-fg -mb-px"
        >
          <span aria-hidden="true" className={`size-2 rounded-full ${section.dot}`} />
          {/* El nombre real de la sección solo lo oyen los lectores de pantalla;
              visualmente se ve el nombre del archivo. */}
          <span className="sr-only">{section.title}: </span>
          {section.file}
        </h2>
      </div>

      {/* ── Contenido (el código) ─────────────────────────────────────────── */}
      {children}

      {/* ── Barra de estado (decorativa) ──────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="flex justify-between border-t border-line bg-black/60 px-4 py-1 text-xs text-muted"
      >
        <span>~/portfolio/{section.file}</span>
        <span>{section.language} · UTF-8</span>
      </div>
      </div>
    </section>
  );
}
