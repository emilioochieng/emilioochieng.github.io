import type { Dict } from './en';

export const fr: Dict = {
  meta: {
    title: '{name} – Construire · Ingénierie · Analyser',
    description: '{name}, développeur web full-stack et ingénieur de données à Nairobi, Kenya. Projets, articles et moyens de me contacter.',
  },
  nav: {
    about: 'À propos', skills: 'Compétences', projects: 'Projets', writing: 'Articles', sql: 'Travaux SQL', contact: 'Contact',
    menu: 'Menu', skip: 'Aller au contenu', language: 'Langue', theme: 'Basculer le mode sombre',
  },
  hero: {
    eyebrow: 'CONSTRUIRE · INGÉNIERIE · ANALYSER',
    hi: 'Bonjour, je suis {name}',
    roleLead: 'Je suis',
    roles: ['Développeur full-stack', 'Ingénieur de données', 'Analyste de données', 'Rédacteur technique'],
    lead: "Je conçois des applications web et des solutions de données que les gens utilisent vraiment, des outils de gestion agricole aux bases de données SQL et à l'analyse des ventes. Basé à Nairobi, Kenya.",
    ctaWork: 'Voir mes projets', ctaTalk: 'Discutons', available: 'Ouvert à de nouvelles missions',
  },
  stats: { projects: 'Projets présentés', repos: 'Dépôts GitHub', languages: 'Langages principaux', open: 'Ouvert aux missions', openValue: 'Oui' },
  about: {
    title: 'À propos de moi',
    p1: "Je suis un développeur et passionné de données qui aime transformer de vrais problèmes en logiciels qui fonctionnent. Mes projets touchent l'agriculture, l'éducation et les finances personnelles, et je développe mes compétences en ingénierie des données et en apprentissage automatique.",
    p2: "J'accorde de l'importance à un code propre, à des interfaces rapides et adaptatives, et à des données fiables. Je suis toujours ouvert à collaborer sur des projets intéressants.",
    p3: "Mon parcours mêle vulgarisation agricole, génie logiciel et ingénierie des données, ce qui garde mon travail proche des vrais utilisateurs.",
  },
  skills: { title: 'Compétences', sub: 'Les outils avec lesquels je travaille.', languages: 'LANGAGES', web: 'WEB', data: 'DONNÉES', tools: 'OUTILS' },
  projects: {
    title: 'Projets', sub: "Une sélection de ce que j'ai construit.",
    all: 'Tous', apps: 'Applications', data: 'Données', education: 'Éducation',
    code: 'Code', live: 'Démo en ligne', inProgress: 'En cours', empty: 'Aucun projet dans cette catégorie pour le moment.',
  },
  github: {
    title: 'Dernier sur GitHub', sub: 'Mes dépôts les plus récents, mis à jour en direct.',
    loading: 'Chargement de mes derniers dépôts…', error: 'Impossible de charger les dépôts pour le moment.',
    empty: "Aucun dépôt public pour l'instant.", viewAll: 'Tout voir sur GitHub', updated: 'Mis à jour', noDescription: 'Aucune description.',
  },
  articles: {
    title: 'Articles', sub: "Ce que je publie sur dev.to.",
    loading: 'Chargement des articles…', empty: 'De nouveaux articles arrivent bientôt. Suivez-moi sur dev.to.',
    error: 'Impossible de charger les articles pour le moment.', minRead: '{n} min de lecture', reactions: 'réactions', viewAll: 'Tout voir sur dev.to',
  },
  sql: {
    title: 'Travaux SQL et bases de données',
    intro: "Conception et interrogation d'une base PostgreSQL dans DBeaver, avec un schéma d'inventaire de « duka » (boutique) : produit, catégorie, prix, stock et fournisseur.",
    c1: 'Écriture de SQL et exploration des résultats de requêtes.', c2: 'Création de la table duka_products et insertion des données.', example: 'Exemple de schéma',
  },
  contact: {
    title: 'Travaillons ensemble', sub: 'Un projet, un poste ou une question ? Envoyez-moi un message.',
    name: 'Votre nom', email: 'Votre e-mail', message: 'Message', send: 'Envoyer le message', sending: 'Envoi…',
    sent: 'Merci ! Votre message a été envoyé. Je vous répondrai bientôt.',
    error: "Votre message n'a pas pu être envoyé. Réessayez ou écrivez-moi directement par e-mail.",
    invalid: 'Veuillez saisir votre nom, un e-mail valide et un message d’au moins 5 caractères.',
    tooFast: 'Veuillez patienter un instant avant d’envoyer un autre message.',
    offline: "Le formulaire n'est pas encore relié à un serveur, j'ai donc ouvert votre application de messagerie.",
    elsewhere: 'Ou retrouvez-moi ici', whatsapp: 'Discuter sur WhatsApp', emailMe: "M'écrire un e-mail", connect: 'Retrouvez-moi en ligne',
  },
  footer: { rights: '© {year} {name} · {location}', top: 'Haut de page' },
};
