// ─────────────────────────────────────────────────────────────────────────────
// useReveal.ts — Detecta cuándo un elemento entra en pantalla (una sola vez).
// ─────────────────────────────────────────────────────────────────────────────
// Se usa para el efecto "según bajas se va viendo la información".
// IntersectionObserver es una API del navegador que avisa cuando un elemento
// cruza el viewport, sin escuchar el evento scroll (que se dispara cientos de
// veces por segundo y es más costoso).
import { useEffect, useRef, useState } from 'react';

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  // false en el servidor y en el primer render del navegador → el HTML
  // pre-renderizado y la hidratación coinciden.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Navegador muy antiguo sin IntersectionObserver: mostramos sin animación.
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // Solo una vez: no se vuelve a ocultar al subir.
        }
      },
      // threshold 0.1: basta con que asome el 10 %.
      // rootMargin: el "borde inferior" se sube un 5 % para que la animación
      // empiece cuando el elemento ya está algo dentro de la pantalla.
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    );
    observer.observe(element);

    // Limpieza: si el componente se desmonta, dejamos de observar.
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
