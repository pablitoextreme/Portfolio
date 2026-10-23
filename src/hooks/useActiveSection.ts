// ─────────────────────────────────────────────────────────────────────────────
// useActiveSection.ts — Indica qué sección se está leyendo ("scrollspy").
// ─────────────────────────────────────────────────────────────────────────────
// La barra de pestañas lo usa para resaltar el archivo activo (about.ts,
// projects.json...) mientras haces scroll.
import { useEffect, useState } from 'react';

export function useActiveSection(ids: readonly string[]): string | null {
  // null al principio (y en el servidor): ninguna pestaña activa.
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    // Observamos una franja fina en el centro de la pantalla: rootMargin
    // recorta un 45 % por arriba y un 50 % por abajo. La sección que cruza esa
    // franja es la que "se está leyendo".
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );

    // Buscamos cada sección por su id; las que no existan se ignoran.
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}
