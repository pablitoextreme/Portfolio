// ─────────────────────────────────────────────────────────────────────────────
// App.tsx — Componente raíz: compone la página completa.
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { profile } from './data/profile';
import { SiteHeader } from './components/SiteHeader';
import { TerminalHero } from './components/TerminalHero';
import { AboutSection } from './components/sections/AboutSection';
import { ExperienceSection } from './components/sections/ExperienceSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { EducationSection } from './components/sections/EducationSection';
import { ContactSection } from './components/sections/ContactSection';

export default function App() {
  // ── Activar las animaciones de aparición ───────────────────────────────────
  // Esta clase en <html> "arma" las reglas CSS que ocultan las secciones hasta
  // que entran en pantalla. Se añade aquí (en el navegador, tras hidratar) y no
  // en el HTML: si el JavaScript falla, nada queda oculto.
  useEffect(() => {
    document.documentElement.classList.add('reveal-ready');
  }, []);

  return (
    <div id="top">
      {/* ── Enlace "saltar al contenido" ────────────────────────────────────── */}
      {/* Invisible hasta que recibe foco con Tab: permite a usuarios de teclado
          saltarse la barra de navegación. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-black"
      >
        Saltar al contenido
      </a>

      <SiteHeader />

      {/* ── Contenido principal ─────────────────────────────────────────────── */}
      {/* max-w-5xl centra y limita el ancho; px-4 = margen lateral de 16 px en móvil. */}
      <main id="contenido" className="mx-auto max-w-5xl px-4">
        <TerminalHero />
        <div className="space-y-16 pb-24 sm:space-y-24">
          <AboutSection />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
          <EducationSection />
          <ContactSection />
        </div>
      </main>

      {/* ── Pie: barra de estado tipo editor ────────────────────────────────── */}
      <footer className="border-t border-line bg-accent/10 text-xs text-muted">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-2 px-4 py-3">
          <span>
            <span aria-hidden="true" className="text-accent">● </span>main · © {new Date().getFullYear()} {profile.name}
          </span>
          <span>React · TypeScript · Vite · Tailwind CSS</span>
        </div>
      </footer>
    </div>
  );
}
