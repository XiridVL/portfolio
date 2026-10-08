# Andrea Capelli: portfolio

Freelance portfolio for Andrea Capelli, full-stack web developer in Rimini. English at `/`, Italian at `/it/`. Built with Astro as a fully static site (no client framework, no third-party requests) and deployed to GitHub Pages.

## Run it locally

Requires Node.js 22 or newer.

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

## Deploy to GitHub Pages

The workflow in `.github/workflows/deploy.yml` runs on every push to `main`:

1. **Quality:** type check, build, `check:compliance`, and Lighthouse budgets on `/`, `/it/` and `/work/vstats/` (scores of 95+ in all four categories, plus byte budgets for HTML, CSS, JS, fonts and images). Any failure stops the deploy. Pull requests run this job only.
2. **Build:** builds the site with the repository's `SITE_URL` and `BASE_PATH`, runs `check:links` and `check:compliance` on that exact build, and uploads it as the Pages artifact.
3. **Deploy:** publishes it to GitHub Pages.

One-time setup: in the repository, go to **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**.

### Site address and base path

Two repository variables control the URLs (**Settings → Secrets and variables → Actions → Variables**). The build reads them as environment variables, so you can also set them locally.

| Variable | Default | Purpose |
|---|---|---|
| `SITE_URL` | `https://xiridvl.github.io` | Origin used for canonical links, hreflang, Open Graph, JSON-LD, `robots.txt` and the sitemap. No trailing path. |
| `BASE_PATH` | `/` | Path the site is served under. |

Pick the case that matches the repository:

- **User site** (repository named `XiridVL.github.io`): served at `https://xiridvl.github.io/`. Keep the defaults: `SITE_URL=https://xiridvl.github.io`, `BASE_PATH=/`.
- **Project site** (any other repository name, e.g. `portfolio`): served at `https://xiridvl.github.io/portfolio/`. Set `BASE_PATH=/portfolio/` (leading and trailing slash) and keep `SITE_URL=https://xiridvl.github.io`. Every internal link, asset and absolute URL picks up the prefix. Crawlers only read `robots.txt` at the origin root, so on a project site the `/portfolio/robots.txt` built with the site (and the sitemap line in it) is ignored: submit `https://xiridvl.github.io/portfolio/sitemap-index.xml` in Google Search Console instead, or use a user site or custom domain.
- **Custom domain:** see below. `BASE_PATH` goes back to `/`.

To try a project-site build locally:

```sh
BASE_PATH=/portfolio/ npm run build
```

### Custom domain

1. Buy the domain (for example `andreacapelli.dev` or `.it`).
2. Create `public/CNAME` containing only the bare domain, e.g. `andreacapelli.dev`. It is copied to the site root on every build, so the setting survives deploys.
3. Set the repository variables `SITE_URL=https://andreacapelli.dev` and `BASE_PATH=/`.
4. At the DNS provider, add the GitHub Pages records: for the apex domain, `A` records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153` (and the matching `AAAA` records if you want IPv6); for `www`, a `CNAME` to `xiridvl.github.io`.
5. In **Settings → Pages**, enter the domain under **Custom domain** and, once the certificate is issued, tick **Enforce HTTPS**.
6. Update `domain` in `src/data/site.ts`.

`public/.nojekyll` must stay: it tells GitHub Pages to serve the `_astro/` folder as is.

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
- vStats links outside the approved list, and any link to the IVPITER domain;
- missing Riot disclaimers (footer, work grid, case studies), beta versions, the Teams billing line and the required project wording;
- prices without the VAT wording;
- third-party origins, raster images on pages and red-coral colour values;
- missing or over-length titles and descriptions, missing canonical, hreflang or Open Graph tags, and invalid JSON-LD.
