export const en = {
  meta: {
    title: '{name} – Build · Engineer · Analyze',
    description: '{name}, full-stack web developer and data engineer in Nairobi, Kenya. Projects, articles and ways to get in touch.',
  },
  nav: {
    about: 'About', skills: 'Skills', projects: 'Projects', writing: 'Writing', sql: 'SQL work', contact: 'Contact',
    menu: 'Menu', skip: 'Skip to content', language: 'Language', theme: 'Toggle dark mode',
  },
  hero: {
    eyebrow: 'BUILD · ENGINEER · ANALYZE',
    hi: "Hi, I'm {name}",
    roleLead: "I'm a",
    roles: ['Full-stack developer', 'Data engineer', 'Data analyst', 'Technical writer'],
    lead: 'I build web applications and data solutions that people actually use, from farm management tools to SQL databases and sales analytics. Based in Nairobi, Kenya.',
    ctaWork: 'View my work', ctaTalk: "Let's talk", available: 'Open to new work',
  },
  stats: { projects: 'Featured projects', repos: 'GitHub repositories', languages: 'Core languages', open: 'Open to new work', openValue: 'Yes' },
  about: {
    title: 'About me',
    p1: 'I’m a developer and data enthusiast who enjoys turning real problems into working software. My projects cover farming, education and personal finance, and I’m growing my skills in data engineering and machine learning.',
    p2: 'I care about clean code, fast and responsive interfaces, and data that can be trusted. I’m always open to collaboration on interesting projects.',
    p3: 'My background spans agriculture extension, software engineering and data engineering, which keeps my work close to real users.',
  },
  skills: { title: 'Skills', sub: 'The tools I work with.', languages: 'LANGUAGES', web: 'WEB', data: 'DATA', tools: 'TOOLS' },
  projects: {
    title: 'Projects', sub: 'A selection of what I’ve built.',
    all: 'All', apps: 'Apps', data: 'Data', education: 'Education',
    code: 'Code', live: 'Live demo', inProgress: 'In progress', empty: 'No projects in this category yet.',
  },
  github: {
    title: 'Latest on GitHub', sub: 'My newest repositories, updated live.',
    loading: 'Loading my newest repositories…', error: 'Could not load repositories right now.',
    empty: 'No public repositories yet.', viewAll: 'View all on GitHub', updated: 'Updated', noDescription: 'No description.',
  },
  articles: {
    title: 'Writing', sub: 'What I publish on dev.to.',
    loading: 'Loading articles…', empty: 'New articles are on the way. Follow me on dev.to.',
    error: 'Could not load articles right now.', minRead: '{n} min read', reactions: 'reactions', viewAll: 'View all on dev.to',
  },
  sql: {
    title: 'SQL & database work',
    intro: 'Designing and querying a PostgreSQL database in DBeaver, using a “duka” (shop) inventory schema with product, category, price, stock and supplier data.',
    c1: 'Writing SQL and exploring query results.', c2: 'Creating the duka_products table and inserting data.', example: 'Example schema',
  },
  contact: {
    title: "Let's work together", sub: 'Have a project, a role or a question? Send me a message.',
    name: 'Your name', email: 'Your email', message: 'Message', send: 'Send message', sending: 'Sending…',
    sent: 'Thank you! Your message was sent. I’ll reply soon.',
    error: 'Your message could not be sent. Please try again or email me directly.',
    invalid: 'Please enter your name, a valid email and a message of at least 5 characters.',
    tooFast: 'Please wait a moment before sending another message.',
    offline: 'The form is not connected to a server yet, so I opened your email app instead.',
    elsewhere: 'Or find me here', whatsapp: 'Chat on WhatsApp', emailMe: 'Email me', connect: 'Find me online',
  },
  footer: { rights: '© {year} {name} · {location}', top: 'Back to top' },
};

type DeepStr<T> = T extends string ? string : T extends readonly (infer U)[] ? DeepStr<U>[] : { [K in keyof T]: DeepStr<T[K]> };
export type Dict = DeepStr<typeof en>;
