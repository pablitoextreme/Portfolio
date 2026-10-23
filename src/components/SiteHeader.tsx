// ─────────────────────────────────────────────────────────────────────────────
// SiteHeader.tsx — Barra superior fija con las pestañas de archivo.
// ─────────────────────────────────────────────────────────────────────────────
// Cada pestaña es un ENLACE a su sección (#about...), no un "tab" de ARIA:
// todo el contenido está siempre en la página y se navega con scroll, así que
// semánticamente es una navegación. Ventajas: funciona sin JavaScript, el
// navegador gestiona el foco y el botón "atrás" del navegador funciona.
import { SECTIONS, SECTION_IDS } from '../data/sections';
import { useActiveSection } from '../hooks/useActiveSection';

export function SiteHeader() {
  const active = useActiveSection(SECTION_IDS);

  return (
    // sticky top-0: se queda pegada arriba al hacer scroll.
    // backdrop-blur + fondo semitransparente: el contenido se intuye por debajo.
    <header className="sticky top-0 z-20 border-b border-line bg-black/85 backdrop-blur">
      <div className="mx-auto flex h-13 max-w-5xl items-stretch px-4">
        {/* Logo / inicio */}
        <a href="#top" className="mr-3 flex shrink-0 items-center text-sm font-bold text-accent">
          <span aria-hidden="true">&gt;_&nbsp;</span>pablo
        </a>

        {/* Pestañas. En móvil caben con scroll horizontal DENTRO de la barra
            (la página nunca hace scroll lateral). */}
        <nav aria-label="Secciones" className="-mb-px min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
          <ul className="flex h-full">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              return (
                <li key={s.id} className="flex">
                  <a
                    href={`#${s.id}`}
                    // aria-current indica al lector de pantalla qué sección se ve.
                    aria-current={isActive ? 'location' : undefined}
                    className={`flex items-center gap-2 whitespace-nowrap border-x border-t-2 px-3 text-xs sm:text-sm ${
                      isActive
                        ? 'border-x-line border-t-accent bg-panel text-fg'
                        : 'border-x-transparent border-t-transparent text-muted hover:text-fg'
                    }`}
                  >
                    <span aria-hidden="true" className={`size-2 rounded-full ${s.dot}`} />
                    {s.file}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
