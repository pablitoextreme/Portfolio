// ─────────────────────────────────────────────────────────────────────────────
// profile.ts — ÚNICA fuente de datos del portfolio.
// ─────────────────────────────────────────────────────────────────────────────
// Todo lo que se ve en la web sale de aquí (y de site.ts). Los componentes solo
// deciden CÓMO mostrarlo. Si quieres cambiar un texto, se cambia en este archivo.
// Los datos proceden de tu CV (V6) y de tus repositorios públicos de GitHub.

// ── Tipos ────────────────────────────────────────────────────────────────────
// Definen la forma de cada dato. Si a un proyecto le falta un campo obligatorio,
// TypeScript da error al compilar: así no se publica nada incompleto.

/** Un enlace con texto visible y URL. */
export type Link = { label: string; url: string };

/** Fecha en formato "AAAA-MM". `null` como fecha de fin significa "actualidad". */
export type YearMonth = `${number}-${number}`;

export type Job = {
  role: string;
  company: string;
  start: YearMonth;
  end: YearMonth | null;
  tasks: string[];
};

export type Project = {
  name: string;
  /** Resumen de una línea. */
  summary: string;
  stack: string[];
  /** Lo que hice en el proyecto (puntos del CV). */
  highlights: string[];
  links: Record<string, string>;
};

export type Study = { title: string; start: number; end: number | null };

// ── Datos personales ─────────────────────────────────────────────────────────
export const profile = {
  name: 'Pablo García García',
  firstName: 'Pablo',
  title: 'Desarrollador Backend Junior',
  location: 'Sant Andreu de la Barca',
  bio:
    'Desarrollador backend en formación (CFGS Desarrollo de Aplicaciones Web), con experiencia ' +
    'práctica construyendo APIs REST en Spring Boot: autenticación JWT, PostgreSQL, migraciones ' +
    'con Flyway, contenedorización con Docker y tests con JUnit/Mockito. Background técnico en ' +
    'sistemas y redes (CFGM SMX, CFGS ASIR) que aporta una visión completa del stack, desde la ' +
    'infraestructura hasta el código.',
  email: 'pablogarciagarcia205@gmail.com',
  links: {
    github: 'https://github.com/pablitoextreme',
    linkedin: 'https://www.linkedin.com/in/pablo-garcia-garcia-510254320/',
  },
  languages: {
    español: 'Nativo',
    catalán: 'Nativo',
    inglés: 'B1-B2',
  },
  strengths: [
    'Capacidad de aprendizaje rápido',
    'Adaptabilidad',
    'Trabajo en equipo',
    'Orientación al detalle',
    'Resolución de problemas',
    'Proactividad',
  ],
} as const;

// ── Experiencia profesional (de la más reciente a la más antigua) ─────────────
export const experience: Job[] = [
  {
    role: 'Técnico Informático',
    company: 'Building Center/Caixabank',
    start: '2026-07',
    end: null,
    tasks: [
      'Gestión y administración de cuentas de usuario mediante Active Directory.',
      'Soporte técnico presencial y remoto a empleados, resolviendo incidencias de hardware y software.',
      'Asistencia en el uso de aplicaciones corporativas (SAP, SAS, Microsoft Teams, Outlook, Microsoft 365).',
      'Instalación, configuración y mantenimiento de equipos, periféricos e impresoras.',
      'Diagnóstico y resolución de incidencias de sistemas operativos Windows, conectividad y aplicaciones.',
    ],
  },
  {
    role: 'Operador de almacenamiento de pedidos',
    company: 'IKEA',
    start: '2023-06',
    end: '2026-06',
    tasks: [
      'Corrección y mantenimiento de una aplicación de automatización de Cartas de Porte, modificando código JavaScript para solucionar errores y mejorar su funcionamiento.',
      'Gestión y análisis de datos mediante Microsoft Excel (tablas, organización y seguimiento de pedidos).',
      'Organización y mantenimiento de información mediante Power BI.',
      'Resolución de incidencias técnicas en herramientas internas utilizadas por el equipo.',
    ],
  },
  {
    role: 'Soporte técnico informático',
    company: 'Hospital Sagrat Cor',
    start: '2022-01',
    end: '2023-11',
    tasks: [
      'Maquetación, preparación y despliegue de equipos mediante imágenes del sistema (PXE/PDI).',
      'Instalación, configuración y mantenimiento de sistemas operativos Windows y aplicaciones corporativas.',
      'Administración de Active Directory: usuarios, grupos, permisos y equipos.',
      'Soporte y administración de Microsoft 365 (Outlook, Teams, OneDrive, Office).',
      'Configuración e instalación de racks, switches, cableado estructurado y puntos de red.',
      'Diagnóstico y resolución de incidencias de hardware, software, red y conectividad.',
    ],
  },
];

// ── Proyectos destacados ─────────────────────────────────────────────────────
export const projects: Project[] = [
  {
    name: 'Marketplace de Microservicios',
    summary: 'E-commerce con 4 microservicios, saga con compensación y despliegue en Kubernetes.',
    stack: [
      'Java 21', 'Spring Boot 3', 'Spring Cloud Gateway (WebFlux)', 'OpenFeign', 'Resilience4j',
      'Spring Security (OAuth2 Resource Server)', 'PostgreSQL', 'Flyway', 'Redis', 'Docker',
      'Kubernetes', 'Testcontainers',
    ],
    highlights: [
      'Diseñé y construí 4 microservicios (catálogo, pagos, pedidos, gateway) orquestados mediante una saga síncrona con compensación automática ante fallos parciales.',
      'Resiliencia entre servicios con Resilience4j (CircuitBreaker + Retry con backoff exponencial + TimeLimiter) sobre llamadas OpenFeign, distinguiendo fallos de negocio de fallos técnicos.',
      'API Gateway (Spring Cloud Gateway, WebFlux) con autenticación JWT (OAuth2 Resource Server) y rate limiting centralizado respaldado por Redis.',
      'Despliegue en Kubernetes (kind): StatefulSet de PostgreSQL, probes de liveness/readiness/startup calibradas para la JVM, Secrets separados del código y aislamiento lógico de la base de datos por servicio.',
      'Tests de integración con Testcontainers contra PostgreSQL y Redis reales (no mocks), incluido un test end-to-end que valida la saga completa.',
    ],
    links: { repo: 'https://github.com/pablitoextreme/marketplace-microservices' },
  },
  {
    name: 'Sport Booking API',
    summary: 'API de reservas con notificaciones por eventos (RabbitMQ), resiliencia y observabilidad.',
    stack: [
      'Java 21', 'Spring Boot 3', 'Spring Security (JWT)', 'PostgreSQL', 'Flyway', 'RabbitMQ',
      'Spring AMQP', 'Docker', 'Maven', 'GitHub Actions', 'Git',
    ],
    highlights: [
      'Pipeline CI/CD con GitHub Actions: ejecución automática de tests y build en cada push/PR.',
      'Notificaciones orientadas a eventos: exchange topic en RabbitMQ (booking.events) con routing keys booking.created/booking.cancelled, consumidas por un notification-service independiente.',
      'Publicación transaccional segura con ApplicationEventPublisher y @TransactionalEventListener(AFTER_COMMIT), evitando notificaciones fantasma ante rollbacks.',
      'notification-service: @RabbitListener, logging estructurado con MDC (bookingId/eventType) y envío de emails vía SMTP.',
      'API REST con JWT y roles (USER/ADMIN), reservas reforzadas con constraint EXCLUDE de PostgreSQL, migraciones con Flyway y tests con JUnit, Mockito y MockMvc.',
      'Caché distribuida con Redis, rate limiting con Bucket4j (429/Retry-After), monitorización con Prometheus/Grafana y logs centralizados en Loki.',
      'Infraestructura como código con Docker Compose: stack completo containerizado (9 servicios) y verificado end-to-end.',
    ],
    links: { repo: 'https://github.com/pablitoextreme/Sistema_De_Reservas' },
  },
  {
    name: 'Employee Management API',
    summary: 'Aplicación full-stack desplegada en producción con CI/CD.',
    stack: [
      'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'JWT', 'Spring Security', 'Docker',
      'Flyway', 'OpenAPI', 'GitHub Actions', 'Railway', 'Vercel',
    ],
    highlights: [
      'Pipeline CI/CD con GitHub Actions: tests y build automáticos, con despliegue continuo a Railway al hacer push a main (solo si pasan los tests).',
      'API REST en Spring Boot con autenticación JWT y control de acceso por roles (USER/ADMIN), consumida por un frontend en React (TypeScript) con rutas protegidas según rol.',
      'Arquitectura por capas, migraciones con Flyway y documentación con Swagger/OpenAPI; CORS y variables de entorno configuradas para producción.',
      'Backend y PostgreSQL desplegados en Railway, frontend en Vercel.',
    ],
    links: {
      backend: 'https://github.com/pablitoextreme/employee-management-api',
      frontend: 'https://github.com/pablitoextreme/employee-management-frontend',
      demo: 'https://employee-management-frontend-zeta-five.vercel.app/',
    },
  },
];

// ── Otros repositorios públicos ──────────────────────────────────────────────
// Sin README ni descripción en GitHub: solo mostramos lo que GitHub indica.
export const otherRepos: Link[] = [
  { label: 'CRUD (Java)', url: 'https://github.com/pablitoextreme/CRUD' },
  { label: 'CRUD-VideoGame (Java)', url: 'https://github.com/pablitoextreme/CRUD-VideoGame' },
];

// ── Habilidades por nivel de uso ─────────────────────────────────────────────
// Las tecnologías salen del CV; el reparto por niveles es una propuesta: revísalo.
export const skills = {
  'a diario': ['Java', 'Spring Boot', 'Spring Security (JWT)', 'PostgreSQL', 'Git / GitHub', 'Docker'],
  'con base': [
    'Flyway', 'Maven', 'JUnit', 'Mockito', 'MockMvc', 'React', 'TypeScript', 'HTML', 'CSS',
    'JavaScript', 'GitHub Actions', 'Railway', 'Vercel', 'Linux', 'Active Directory',
  ],
  aprendiendo: [
    'Kubernetes', 'RabbitMQ', 'Redis', 'Resilience4j', 'Spring Cloud Gateway', 'Testcontainers',
    'Prometheus / Grafana',
  ],
} as const;

// ── Formación ────────────────────────────────────────────────────────────────
export const education: Study[] = [
  { title: 'CFGS · Desarrollo de Aplicaciones Web (DAW)', start: 2025, end: null },
  {
    title: 'CFGS · Administración de Sistemas Informáticos en Red (ASIR), especialización en Ciberseguridad',
    start: 2022,
    end: 2024,
  },
  { title: 'CFGM · Sistemas Microinformáticos y Redes (SMX)', start: 2020, end: 2022 },
];
