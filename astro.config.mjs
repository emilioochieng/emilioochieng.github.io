import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://emilioochieng.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin/'),
      i18n: { defaultLocale: 'en', locales: { en: 'en', sw: 'sw', fr: 'fr', es: 'es' } },
    }),
  ],
});
