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
  vite: {
    build: {
      // esbuild, not Lightning CSS (Vite's default): Lightning CSS folds
      // `animation-timeline: view()` into the `animation` shorthand, which
      // browsers reject, so every scroll-driven animation silently disappears.
      // scripts/compliance-check.mjs fails the build if that ever comes back.
      cssMinify: 'esbuild',
      // Stylesheets up to 12 KB (e.g. the product-mockup styles shared by the
      // home and case-study pages) ship inside the page instead of costing an
      // extra render-blocking request (build.inlineStylesheets is 'auto').
      // Other assets keep Vite's default 4 KB limit, so fonts stay files.
      assetsInlineLimit: (file, content) => (file.endsWith('.css') ? content.length <= 12 * 1024 : undefined),
    },
  },
  integrations: [
    // No sitemap i18n option: it cannot pair /work/x/ with /it/lavori/x/ and
    // would emit hreflang codes that differ from the pages. Every page head
    // carries complete en / it / x-default alternates instead.
    sitemap(),
  ],
});
