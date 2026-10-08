# Andrea Capelli: portfolio

Freelance portfolio for Andrea Capelli, full-stack web developer in Rimini. English at `/`, Italian at `/it/`. Built with Astro as a fully static site (no client framework, no third-party requests) and deployed to Render.

## Run it locally

Requires Node.js 22 or newer (24 is what CI and Render use, see `.node-version`).

```sh
npm install
npm run dev            # http://localhost:4321
npm run build          # static site in dist/
npm run preview        # serve dist/ locally
npm run check          # type and template check
npm run check:compliance   # content and SEO gate over dist/ and the sources (run after build)
npm run check:links        # every route from the sitemap, internal link, anchor and aria id reference in dist/ (BASE_PATH aware)
```

`npm run build` also renders the Open Graph images (`/og/{locale}-{page}.png`), the PNG favicons, `robots.txt` and the sitemap.

## Deploy to Render

The site is a Render **static site**, described in `render.yaml` (a Render Blueprint).

One-time setup:

1. Push the repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com/), choose **New → Blueprint**, connect GitHub and select the repository. Render reads `render.yaml`, creates the `andrea-capelli-portfolio` static site and deploys the default branch.
3. The site goes live at `https://andrea-capelli-portfolio.onrender.com` (Render adds a suffix if that name is taken; the build picks up the real address automatically).

After that, every push to `main` deploys on its own:

1. **CI** (`.github/workflows/ci.yml`) runs on every push and pull request: type check, build, `check:compliance`, `check:links`, and Lighthouse budgets on `/`, `/it/` and `/work/vstats/` (scores of 95+ in all four categories, plus byte budgets for HTML, CSS, JS, fonts and images).
2. **Render** waits for those checks to pass on the commit (`autoDeployTrigger: checksPass`), then builds with `npm ci && npm run build && npm run check:links && npm run check:compliance`. A failing check stops the deploy, and the previous version stays online.
3. The built `dist/` is published to Render's CDN. Hashed assets under `/_astro/` are served with a one-year immutable cache; every page gets basic security headers. A missing path is answered with `404.html`.

Node.js comes from `.node-version` (24), for both Render and CI.

### Site address and base path

Two environment variables control the URLs. Set them on the Render service (**Environment**), or locally for a test build.

| Variable | Default | Purpose |
|---|---|---|
| `SITE_URL` | the service's `onrender.com` URL on Render (`RENDER_EXTERNAL_URL`), `https://andrea-capelli-portfolio.onrender.com` locally | Origin used for canonical links, hreflang, Open Graph, JSON-LD, `robots.txt` and the sitemap. No trailing path. |
| `BASE_PATH` | `/` | Path the site is served under. Keep `/` on Render. |

### Custom domain

1. Buy the domain (for example `andreacapelli.dev` or `.it`).
2. In the Render service, open **Settings → Custom Domains**, add the domain and follow the DNS records Render shows for your provider (remove any `AAAA` records). Adding the apex also adds `www` and redirects one to the other. Render issues and renews the TLS certificate.
3. Set `SITE_URL=https://andreacapelli.dev` on the service (**Environment**, or uncomment it in `render.yaml`) and redeploy, so canonical links, the sitemap and Open Graph tags use the domain.
4. Update `domain` in `src/data/site.ts`.

## Where to edit things

All visible copy is final and lives in data files, not in the page templates. Edit both languages together.

| What | File |
|---|---|
| Name, email, GitHub and LinkedIn URLs, city, coordinates, domain | `src/data/site.ts` |
| **P.IVA and business address** (required before launch) | `src/data/site.ts` (`vatNumber`, `businessAddress`) |
| VAT wording on prices (`+ VAT where due` / `+ IVA se dovuta`) | `src/data/site.ts` (`vatApplies`; set to `false` under the *regime forfettario*, and update FAQ 5 in `src/i18n/home.ts`) |
| Package prices, durations, bullets, hourly and day rates, care plan, deposit | `src/data/services.ts` (prices are numbers; formatting per locale is automatic) |
| Home page copy (hero, proof figures, process, about, FAQ, contact) | `src/i18n/home.ts` |
| Header, footer, buttons and other shared labels | `src/i18n/en.ts` and `src/i18n/it.ts` (the two files must have the same keys) |
| Work cards (chips, one-liners, spec rows, external links) | `src/data/projects.ts` |
| Case-study pages | `src/data/case-studies/*.ts` |
| Page titles, meta descriptions and Open Graph titles | `src/data/meta.ts` |
| URL slugs per language | `src/i18n/routes.ts` |
| Colours, spacing and type scale | `src/styles/tokens.css` |
| Structured data (Person, ProfessionalService, FAQ, case studies) | `src/lib/jsonld.ts`, bundled by `src/lib/seo.ts` |
| Open Graph image layout | `src/pages/og/[image].png.ts` (fonts in `src/lib/og.ts`) |

Never type a price into copy: use the values in `src/data/services.ts`, so the site, the structured data and the VAT wording stay in sync.

## Before launch

- Fill in `vatNumber` and `businessAddress` in `src/data/site.ts`.
- Confirm the IVPITER naming and wording with the client.
- Check the vStats Desktop wording against Riot's current developer policy.
- Choose the domain, then follow **Custom domain** above.
- `npm run check:compliance` must pass; it also lists the empty tax fields as warnings.

## Compliance gate

`scripts/compliance-check.mjs` scans `dist/` and the repository sources and fails on:

- banned wording, internal names, hosts or variables, and unverified claims;
- em dashes anywhere a visitor reads (house style: use a comma, colon, full stop or " · ");
- vStats links outside the approved list, and any link to the IVPITER domain;
- missing Riot disclaimers (footer, work grid, case studies), beta versions, the Teams billing line and the required project wording;
- prices without the VAT wording;
- third-party origins, raster images on pages and red-coral colour values;
- missing or over-length titles and descriptions, missing canonical, hreflang or Open Graph tags, and invalid JSON-LD.
