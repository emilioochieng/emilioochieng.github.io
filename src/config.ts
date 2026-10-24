// One place for everything personal. Edit this file, not the components.
export const SITE = {
  url: 'https://emilioochieng.github.io',
  name: 'Emilio Odongo',                 // CONFIRM: your live site says Odongo, your accounts say Ochieng
  initials: 'EO',
  location: 'Nairobi, Kenya',
  email: 'emilioochieng44@gmail.com',
  whatsapp: '254705216347',              // digits only, international format. CONFIRM this is the number to show
  social: {
    github: 'emilioochieng',
    linkedin: 'https://www.linkedin.com/in/emilio-ochieng-3b11b73ab',
    devto: 'emilioochieng',              // CONFIRM your dev.to username (the part after dev.to/)
    twitter: '',                         // your X/Twitter username without @. Blank hides the link
  },
  supabase: {
    url: import.meta.env.PUBLIC_SUPABASE_URL ?? '',
    anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '',
  },
} as const;

export const hasBackend = Boolean(SITE.supabase.url && SITE.supabase.anonKey);
