export type Category = 'apps' | 'data' | 'education';
export interface Project {
  id: string; title: string; category: Category; kind: string;
  description: string; stack: string[]; live?: string; code?: string; inProgress?: boolean;
}

// Curated baseline. Extra projects can be added from the admin dashboard without redeploying.
export const projects: Project[] = [
  { id: 'smartfarm', title: 'Smartfarm', category: 'apps', kind: 'Web app · Agritech',
    description: 'A modern way to manage your farm online, built to be simple and powerful for farmers.',
    stack: ['JavaScript', 'FastAPI', 'PostgreSQL', 'Tailwind'], code: 'https://github.com/emilioochieng/Smartfarm' },
  { id: 'managefarm', title: 'managefarm', category: 'apps', kind: 'Web app · Agritech',
    description: 'Online farm management app for day-to-day farm operations.',
    stack: ['Web'], code: 'https://github.com/emilioochieng/managefarm' },
  { id: 'elanvoire', title: 'Elanvoire', category: 'apps', kind: 'Web app · E-commerce', inProgress: true,
    description: 'Kenya-first luxury multi-brand store with an admin dashboard and M-Pesa STK Push checkout on Supabase.',
    stack: ['JavaScript', 'Supabase', 'M-Pesa Daraja'] },
  { id: 'wallet', title: 'Wallet System', category: 'apps', kind: 'Software · Fintech',
    description: 'Command-line wallet with deposits, withdrawals, send money, Lipa na M-Pesa, loans and savings.',
    stack: ['Python', 'SQLite'] },
  { id: 'expense', title: 'Expense Tracker', category: 'apps', kind: 'Web app · Fintech',
    description: 'Responsive tracker where you add, filter and delete expenses by category and see a live total. Data is saved in the browser.',
    stack: ['JavaScript'], live: 'https://emilioochieng.github.io/oop/', code: 'https://github.com/emilioochieng/oop' },
  { id: 'pharmacy', title: 'Pharmacy Sales Analysis', category: 'data', kind: 'Data analysis · Python',
    description: 'Cleaned and analysed 6,000 pharmacy sales records with Python and pandas: revenue trends, categories, channels, payments and customers.',
    stack: ['Python', 'pandas'] },
  { id: 'jcars', title: 'Jcars Sales Dashboard', category: 'data', kind: 'Data analysis · Power BI', inProgress: true,
    description: 'Car sales data cleaned in Google Colab, then modelled into a Power BI dashboard.',
    stack: ['Python', 'Google Colab', 'Power BI'] },
  { id: 'innovation', title: 'Innovation School', category: 'education', kind: 'Website · Education',
    description: 'Website for an innovation school presenting its programs and learning content.',
    stack: ['HTML', 'CSS', 'JavaScript'], code: 'https://github.com/emilioochieng/innovationschool' },
  { id: 'schoolweb', title: 'School Web', category: 'education', kind: 'Website · Education',
    description: 'An online learning platform for schools.',
    stack: ['Web'], code: 'https://github.com/emilioochieng/school-web' },
];

export const skills = {
  languages: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML & CSS'],
  web: ['React', 'Next.js', 'Node.js', 'Express', 'FastAPI', 'TailwindCSS'],
  data: ['PostgreSQL', 'MongoDB', 'DBeaver', 'pandas', 'Data cleaning', 'Data modeling'],
  tools: ['Git & GitHub', 'Docker', 'AWS', 'Google Colab'],
} as const;
