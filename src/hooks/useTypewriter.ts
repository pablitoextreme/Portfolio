// ─────────────────────────────────────────────────────────────────────────────
// useTypewriter.ts — Efecto de "máquina de escribir" para la portada.
// ─────────────────────────────────────────────────────────────────────────────
// Principio clave: MEJORA PROGRESIVA. El texto completo ya está en el HTML.
// Este hook solo lo "esconde y lo vuelve a escribir" si se cumplen las
// condiciones, que decide el script en línea de index.html (clase
// "typing-pending" en <html>): hay JavaScript, no se pide movimiento reducido
// y no se ha visto ya en esta pestaña.
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';

/** Línea de terminal: un comando (se teclea letra a letra) o su salida (aparece de golpe). */
export type TerminalLine = { kind: 'command' | 'output'; text: string };

// Clave de sessionStorage. Debe coincidir con la del script de index.html.
const SEEN_KEY = 'hero-typed';

// Velocidades en milisegundos. Total ≈ 2 s: breve, como pide el diseño.
const CHAR_DELAY = 45; // entre letras de un comando
const OUTPUT_DELAY = 280; // pausa antes de mostrar una salida
const COMMAND_DELAY = 220; // pausa antes de empezar un comando nuevo

export function useTypewriter(lines: readonly TerminalLine[]) {
  // ── "Pasos" de la animación ────────────────────────────────────────────────
  // Un comando cuenta tantos pasos como letras; una salida cuenta 1 paso.
  // `progress` = cuántos pasos se han dado. Con progress === total se ve todo.
  const steps = useMemo(
    () => lines.map((l) => (l.kind === 'command' ? l.text.length : 1)),
    [lines],
  );
  const total = useMemo(() => steps.reduce((a, b) => a + b, 0), [steps]);

  // Estado inicial = todo visible. Es lo mismo que pinta el servidor, así la
  // hidratación de React no detecta diferencias.
  const [progress, setProgress] = useState(total);
  const [running, setRunning] = useState(false);

  // ── Arranque ───────────────────────────────────────────────────────────────
  // useLayoutEffect se ejecuta tras actualizar el DOM pero ANTES de que el
  // navegador pinte: reiniciamos a 0 y quitamos la clase que ocultaba el texto
  // en el mismo fotograma, sin parpadeo del texto completo.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains('typing-pending')) {
      setProgress(0);
      setRunning(true);
    }
    root.classList.remove('typing-pending');
  }, []);

  // ── Terminar (o saltar) ────────────────────────────────────────────────────
  // useCallback mantiene la misma función entre renders para poder usarla como
  // dependencia de efectos sin reiniciarlos.
  const finish = useCallback(() => {
    setProgress(total);
    setRunning(false);
    try {
      sessionStorage.setItem(SEEN_KEY, '1'); // no repetir al recargar
    } catch {
      /* almacenamiento bloqueado: no pasa nada */
    }
  }, [total]);

  // ── Bucle de la animación ──────────────────────────────────────────────────
  // Cada vez que cambia `progress` programamos el siguiente paso con setTimeout.
  // Más sencillo que un setInterval y permite pausas distintas en cada paso.
  useEffect(() => {
    if (!running) return;
    if (progress >= total) {
      finish();
      return;
    }

    // ¿En qué línea y posición está el siguiente paso?
    let before = 0;
    let index = 0;
    while (index < steps.length && before + (steps[index] ?? 0) <= progress) {
      before += steps[index] ?? 0;
      index++;
    }
    const current = lines[index];
    const atLineStart = progress === before;
    const delay =
      current?.kind === 'output' ? OUTPUT_DELAY : atLineStart && index > 0 ? COMMAND_DELAY : CHAR_DELAY;

    const timer = setTimeout(() => setProgress((p) => p + 1), delay);
    return () => clearTimeout(timer); // si se salta o desmonta, cancelamos
  }, [running, progress, total, steps, lines, finish]);

  // ── Saltar con la tecla Escape ─────────────────────────────────────────────
  // Solo escuchamos el teclado mientras la animación está en marcha.
  useEffect(() => {
    if (!running) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [running, finish]);

  // ── Resultado: cuántas letras se ven de cada línea ─────────────────────────
  let consumed = 0;
  const visibleChars = lines.map((l, i) => {
    const stepCount = steps[i] ?? 0;
    const done = Math.min(Math.max(progress - consumed, 0), stepCount);
    consumed += stepCount;
    if (l.kind === 'output') return done >= 1 ? l.text.length : 0;
    return done;
  });

  // Línea en la que va el cursor: la primera que no está completa.
  const cursorLine = running ? visibleChars.findIndex((n, i) => n < (lines[i]?.text.length ?? 0)) : -1;

  return { running, skip: finish, visibleChars, cursorLine };
}
