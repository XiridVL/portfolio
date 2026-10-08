// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL: replace with the custom domain once chosen (and add public/CNAME).
// BASE_PATH: '/' for XiridVL.github.io or a custom domain; '/<repo>/' for a project page.
const site = process.env.SITE_URL ?? 'https://xiridvl.github.io';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'auto', format: 'directory' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'it'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    // No sitemap i18n option: it cannot pair /work/x/ with /it/lavori/x/ and
    // would emit hreflang codes that differ from the pages. Every page head
    // carries complete en / it / x-default alternates instead.
    sitemap(),
  ],
});
