import type { Dict } from './en';

export const es: Dict = {
  meta: {
    title: '{name} – Construir · Ingeniería · Analizar',
    description: '{name}, desarrollador web full-stack e ingeniero de datos en Nairobi, Kenia. Proyectos, artículos y formas de contactarme.',
  },
  nav: {
    about: 'Sobre mí', skills: 'Habilidades', projects: 'Proyectos', writing: 'Artículos', sql: 'Trabajo SQL', contact: 'Contacto',
    menu: 'Menú', skip: 'Saltar al contenido', language: 'Idioma', theme: 'Cambiar modo oscuro',
  },
  hero: {
    eyebrow: 'CONSTRUIR · INGENIERÍA · ANALIZAR',
    hi: 'Hola, soy {name}',
    roleLead: 'Soy',
    roles: ['Desarrollador full-stack', 'Ingeniero de datos', 'Analista de datos', 'Redactor técnico'],
    lead: 'Creo aplicaciones web y soluciones de datos que la gente realmente usa, desde herramientas de gestión agrícola hasta bases de datos SQL y análisis de ventas. Desde Nairobi, Kenia.',
    ctaWork: 'Ver mi trabajo', ctaTalk: 'Hablemos', available: 'Disponible para nuevos trabajos',
  },
  stats: { projects: 'Proyectos destacados', repos: 'Repositorios de GitHub', languages: 'Lenguajes principales', open: 'Disponible para trabajo', openValue: 'Sí' },
  about: {
    title: 'Sobre mí',
    p1: 'Soy desarrollador y apasionado de los datos que disfruta convirtiendo problemas reales en software que funciona. Mis proyectos abarcan agricultura, educación y finanzas personales, y estoy ampliando mis habilidades en ingeniería de datos y aprendizaje automático.',
    p2: 'Me importa el código limpio, las interfaces rápidas y adaptables, y los datos en los que se puede confiar. Siempre estoy abierto a colaborar en proyectos interesantes.',
    p3: 'Mi trayectoria combina extensión agrícola, ingeniería de software e ingeniería de datos, lo que mantiene mi trabajo cerca de los usuarios reales.',
  },
  skills: { title: 'Habilidades', sub: 'Las herramientas con las que trabajo.', languages: 'LENGUAJES', web: 'WEB', data: 'DATOS', tools: 'HERRAMIENTAS' },
  projects: {
    title: 'Proyectos', sub: 'Una selección de lo que he construido.',
    all: 'Todos', apps: 'Aplicaciones', data: 'Datos', education: 'Educación',
    code: 'Código', live: 'Demo en vivo', inProgress: 'En curso', empty: 'Aún no hay proyectos en esta categoría.',
  },
  github: {
    title: 'Lo último en GitHub', sub: 'Mis repositorios más recientes, actualizados en vivo.',
    loading: 'Cargando mis repositorios recientes…', error: 'No se pudieron cargar los repositorios ahora mismo.',
    empty: 'Aún no hay repositorios públicos.', viewAll: 'Ver todos en GitHub', updated: 'Actualizado', noDescription: 'Sin descripción.',
  },
  articles: {
    title: 'Artículos', sub: 'Lo que publico en dev.to.',
    loading: 'Cargando artículos…', empty: 'Pronto habrá nuevos artículos. Sígueme en dev.to.',
    error: 'No se pudieron cargar los artículos ahora mismo.', minRead: '{n} min de lectura', reactions: 'reacciones', viewAll: 'Ver todos en dev.to',
  },
  sql: {
    title: 'Trabajo con SQL y bases de datos',
    intro: 'Diseño y consulta de una base de datos PostgreSQL en DBeaver, con un esquema de inventario de «duka» (tienda): producto, categoría, precio, existencias y proveedor.',
    c1: 'Escribiendo SQL y explorando los resultados de las consultas.', c2: 'Creando la tabla duka_products e insertando datos.', example: 'Esquema de ejemplo',
  },
  contact: {
    title: 'Trabajemos juntos', sub: '¿Tienes un proyecto, un puesto o una pregunta? Envíame un mensaje.',
    name: 'Tu nombre', email: 'Tu correo', message: 'Mensaje', send: 'Enviar mensaje', sending: 'Enviando…',
    sent: '¡Gracias! Tu mensaje fue enviado. Te responderé pronto.',
    error: 'No se pudo enviar tu mensaje. Inténtalo de nuevo o escríbeme directamente por correo.',
    invalid: 'Introduce tu nombre, un correo válido y un mensaje de al menos 5 caracteres.',
    tooFast: 'Espera un momento antes de enviar otro mensaje.',
    offline: 'El formulario aún no está conectado a un servidor, así que abrí tu aplicación de correo.',
    elsewhere: 'O encuéntrame aquí', whatsapp: 'Chatear por WhatsApp', emailMe: 'Escríbeme un correo', connect: 'Encuéntrame en línea',
  },
  footer: { rights: '© {year} {name} · {location}', top: 'Volver arriba' },
};
