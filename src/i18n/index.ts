import { en, type Dict } from './en';
import { sw } from './sw';
import { fr } from './fr';
import { es } from './es';

export const LANGS = {
  en: { native: 'English', locale: 'en-KE' },
  sw: { native: 'Kiswahili', locale: 'sw-KE' },
  fr: { native: 'Français', locale: 'fr-FR' },
  es: { native: 'Español', locale: 'es-ES' },
} as const;

export type Lang = keyof typeof LANGS;
export const LANG_CODES = Object.keys(LANGS) as Lang[];
export const DEFAULT_LANG: Lang = 'en';
const dict: Record<Lang, Dict> = { en, sw, fr, es };

export const isLang = (v: string | null | undefined): v is Lang => !!v && v in LANGS;
export const getDict = (lang: Lang): Dict => dict[lang];

/** Replace {placeholders}: fmt('Hi {name}', { name: 'Emilio' }) */
export const fmt = (s: string, vars: Record<string, string | number> = {}) =>
  s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
