// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL: the canonical origin; set it on Render once a custom domain is attached.
// Without it, Render builds use the service's own URL (RENDER_EXTERNAL_URL), and
// local builds fall back to the default onrender.com address below.
// BASE_PATH: '/' unless the site is served under a sub-path ('/<path>/').
const site = process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || 'https://andrea-capelli-portfolio.onrender.com';
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
