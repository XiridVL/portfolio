#!/usr/bin/env node
/**
 * Pre-launch compliance gate (spec §17, plus the §14 meta basics).
 *
 *   npm run build && npm run check:compliance
 *
 * Scans the built site in dist/ and the repository sources. Exits with code 1
 * when any rule fails, so CI can block a deploy.
 *
 * Denylisted words and internal names are stored ROT13-encoded below, so the
 * denylist itself does not put those terms into the repository in plain text.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');

/** Repository paths scanned as source (dist/ is scanned separately). */
const SOURCE_SKIP = new Set(['node_modules', 'dist', '.git', '.astro', 'package-lock.json', '.lighthouseci']);
const TEXT_EXT = new Set(['.astro', '.ts', '.mts', '.js', '.mjs', '.cjs', '.json', '.md', '.css', '.html', '.svg', '.txt', '.xml', '.yml', '.yaml', '.webmanifest', '']);

const rot13 = (s) => s.replace(/[a-z]/gi, (c) => String.fromCharCode(((c.toLowerCase().charCodeAt(0) - 97 + 13) % 26) + (c <= 'Z' ? 65 : 97)));
const decode = (list) => list.map(rot13);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

/** §17.1 Tooling words: matched as substrings, case-insensitive. */
const BANNED_WORDS = decode(['pynhqr', 'yyz', 'tcg', 'pbcvybg', 'nffvfgnag', 'trarengrq']);
/** The two-letter acronym is matched case-sensitively: lowercase "ai" is an Italian preposition. */
const BANNED_ACRONYM = new RegExp(`\\b${rot13('NV')}\\b`, 'g');
const BANNED_RE = new RegExp(BANNED_WORDS.map(escapeRe).join('|'), 'gi');
/** "… at build" is tolerated in the Astro config only. */
const BANNED_CONFIG_EXCEPTION = new RegExp(escapeRe(rot13('trarengrq ng ohvyq')), 'gi');

/** §17.7 Internal names, hosts and variables that must never ship. */
const INTERNAL_TERMS = decode([
  'uraevxqri',
  'xbtav',
  'inybenax',
  'grfg.ifgngf.klm',
  'vicvgre.grfg',
  'pbaarpg_pyvragf',
  'gnhev_fvtavat',
  'ifgngf_pyvrag_frperg',
  'vcy_obg_gbxra',
  'lbhghor_ncv_xrl',
  'inybenag-ncv.pbz',
  'iye.tt',
]);
const INTERNAL_RE = new RegExp(`${INTERNAL_TERMS.map(escapeRe).join('|')}|\\bprice_[A-Za-z0-9]{8,}\\b|\\b\\d+ commits\\b`, 'gi');

/** §17.2 / §0 Authorship, invented claims and removed statements (visible copy). */
const COPY_RULES = [
  { id: 'authorship', re: /\bsole (?:developer|author|engineer|builder)\b|\bsingle-handedly\b|\bbuilt (?:it |everything |this )?alone\b|\bby myself\b|\b(?:realizzat[oa]|costruit[oa]|sviluppat[oa]) da solo\b|\bunico sviluppatore\b/gi },
  {
    id: 'unverified claim',
    re: /\bavailable from\b|\bdisponibile da\b|\bpaying (?:users|customers|subscribers)\b|\butenti paganti\b|\btwo active payment channels\b|\b113 matches\b|\bseptember 2026\b|\bsettembre 2026\b|\blaunch offer\b|\bofferta di lancio\b|\bcoupons?\b|\bpublic OAuth provider\b|\bahead of a public launch\b|\bswitched on per environment\b|\bfrom one-page forms\b|\bformspree\b|\brevenue\b|\bApp Store (?:channel|sales|revenue|customers)\b/gi,
  },
  { id: 'desktop wording', re: /\boverlays?\b|\breveal(?:s|ed|ing)?\b|\bhack(?:s|ed|ing|er|ers)?\b/gi },
  { id: 'arbiter wording', re: /\bcheat detector\b|\bdetects? cheat|\banti-?cheat\b|\bcatch(?:es)? cheaters\b/gi },
  { id: 'ivpiter status', re: /\bIVPITER\b[^.]{0,60}\b(?:is live|now live|launch(?:ed|es|ing))\b/gi },
];
/** "records" is reserved: the apps capture match data, not video (case pages for the Windows apps). */
const RECORDS_RE = /\brecord(?:s|ed|ing)?\b/gi;

/** §17.10 External vStats links allowed in hrefs. */
const VSTATS_ALLOWED = new Set([
  'https://www.vstats.xyz/',
  'https://www.vstats.xyz/arbiter',
  'https://www.vstats.xyz/rank-distribution',
  'https://www.vstats.xyz/teams',
  'https://www.vstats.xyz/download/teams',
  'https://status.vstats.xyz/',
]);

/** §17.11 Red-coral accent (VALORANT red and close cousins) used as a colour value. */
const CORAL_RE = /:\s*coral\b|#(?:ff4655|fd4556|ff7f50|ff5a5f)\b|rgb\(\s*255[ ,]+70[ ,]+85\b/gi;
const SELF = 'scripts/compliance-check.mjs';

/** §16 Riot disclaimer lines. */
const DISCLAIMER = {
  siteEn: 'VALORANT and Riot Games are trademarks of Riot Games, Inc.',
  siteIt: 'VALORANT e Riot Games sono marchi di Riot Games, Inc.',
  gridEn: 'These projects are not affiliated with or endorsed by Riot Games.',
  gridIt: 'Questi progetti non sono affiliati a Riot Games né approvati da Riot Games.',
  projectEn: 'This project is not affiliated with or endorsed by Riot Games.',
  projectIt: 'Questo progetto non è affiliato a Riot Games né approvato da Riot Games.',
};

/** The suffix, or the FAQ statement that prices exclude VAT (covers prices quoted in the FAQ). */
const VAT_SUFFIX = /\bVAT where due\b|\bIVA se dovuta\b|\bexclude VAT\b|\bal netto dell'IVA\b/i;
const PRICE_RE = /€\s?\d/;

const CASE_SLUGS = ['vstats', 'vstats-desktop', 'vstats-teams', 'ivpiter'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const failures = [];
const warnings = [];
const fail = (rule, where, detail) => failures.push({ rule, where, detail });
const warn = (rule, where, detail) => warnings.push({ rule, where, detail });

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, skip = new Set()) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full, skip)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', middot: '·', euro: '€' };
function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code) => {
    if (code[0] === '#') return String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10));
    return ENTITIES[code.toLowerCase()] ?? m;
  });
}

/** Normalise quotes and whitespace so copy comparisons ignore typography. */
const normalise = (s) => s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

const BLOCK_TAGS = 'p|li|dt|dd|div|h[1-6]|td|th|tr|section|article|aside|header|footer|nav|main|figure|figcaption|label|legend|summary|details|blockquote|ul|ol|dl|table|form|fieldset|br|hr|button|a';

/** Visible copy of an HTML document: body text plus alt, aria-label, title and meta content. Blocks are separated by newlines. */
function visibleCopy(html) {
  const head = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  const attrs = [];
  for (const m of html.matchAll(/\s(?:alt|aria-label|title|placeholder)="([^"]*)"/gi)) attrs.push(m[1]);
  for (const m of head.matchAll(/<meta[^>]+content="([^"]*)"/gi)) attrs.push(m[1]);
  const title = head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  const text = body
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(new RegExp(`</?(?:${BLOCK_TAGS})\\b[^>]*>`, 'gi'), '\n')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map((line) => normalise(decodeEntities(line)))
    .filter(Boolean);
  return { body: text, attrs: [title, ...attrs].map((a) => normalise(decodeEntities(a))) };
}

const lineOf = (text, index) => text.slice(0, index).split('\n').length;
const rel = (p) => relative(ROOT, p).split(sep).join('/');

/** Page classification from the dist-relative path ('work/vstats/index.html'). */
function classify(distPath) {
  const p = distPath.replace(/index\.html$/, '');
  const locale = p.startsWith('it/') ? 'it' : 'en';
  const slug = CASE_SLUGS.find((s) => p === `work/${s}/` || p === `it/lavori/${s}/`);
  return { locale, slug, isHome: p === '' || p === 'it/', is404: distPath === '404.html' };
}

// ---------------------------------------------------------------------------
// Source checks
// ---------------------------------------------------------------------------

async function checkSources() {
  const files = (await walk(ROOT, SOURCE_SKIP)).filter((f) => TEXT_EXT.has(extname(f)));
  for (const file of files) {
    const name = rel(file);
    const raw = await readFile(file, 'utf8');
    const text = name === 'astro.config.mjs' ? raw.replace(BANNED_CONFIG_EXCEPTION, '') : raw;
    for (const m of text.matchAll(BANNED_RE)) fail('banned word', `${name}:${lineOf(text, m.index)}`, `"${m[0]}"`);
    for (const m of text.matchAll(BANNED_ACRONYM)) fail('banned word', `${name}:${lineOf(text, m.index)}`, `"${m[0]}"`);
    if (name === SELF) continue;
    for (const m of raw.matchAll(INTERNAL_RE)) fail('internal detail', `${name}:${lineOf(raw, m.index)}`, `"${m[0]}"`);
    for (const m of raw.matchAll(CORAL_RE)) fail('red-coral accent', `${name}:${lineOf(raw, m.index)}`, `"${m[0]}"`);
    for (const m of raw.matchAll(/https?:\/\/[^\s'"`<>)\]]*/g)) checkExternalUrl(m[0], `${name}:${lineOf(raw, m.index)}`);
  }
}

function checkExternalUrl(url, where) {
  let parsed;
  try {
    parsed = new URL(url.replace(/[.,;:]+$/, ''));
  } catch {
    return;
  }
  const host = parsed.hostname.toLowerCase();
  if (host.includes('ivpiter')) fail('ivpiter link', where, url);
  if (host === 'vstats.xyz' || host.endsWith('.vstats.xyz')) {
    const normal = `${parsed.protocol}//${host}${parsed.pathname.replace(/\/$/, '') || '/'}`;
    if (!VSTATS_ALLOWED.has(normal)) fail('vstats link', where, url);
  }
}

// ---------------------------------------------------------------------------
// Built site checks
// ---------------------------------------------------------------------------

async function checkDist(vatApplies) {
  const files = await walk(DIST);
  const siteHost = await readSiteHost();
  for (const file of files) {
    const name = relative(DIST, file).split(sep).join('/');
    const ext = extname(file);
    if (!TEXT_EXT.has(ext)) continue;
    const raw = await readFile(file, 'utf8');
    const where = `dist/${name}`;

    for (const m of raw.matchAll(BANNED_RE)) fail('banned word', `${where}:${lineOf(raw, m.index)}`, `"${m[0]}"`);
    for (const m of raw.matchAll(BANNED_ACRONYM)) fail('banned word', `${where}:${lineOf(raw, m.index)}`, `"${m[0]}"`);
    for (const m of raw.matchAll(INTERNAL_RE)) fail('internal detail', where, `"${m[0]}"`);
    for (const m of raw.matchAll(CORAL_RE)) fail('red-coral accent', where, `"${m[0]}"`);
    if (ext === '.css' || ext === '.html') checkThirdParty(raw, where, siteHost);
    if (ext === '.html') checkPage(name, raw, where, vatApplies);
  }
}

async function readSiteHost() {
  const fromEnv = process.env.SITE_URL;
  if (fromEnv) return new URL(fromEnv).hostname;
  const config = await readFile(join(ROOT, 'astro.config.mjs'), 'utf8');
  const fallback = config.match(/SITE_URL\s*\?\?\s*['"]([^'"]+)['"]/)?.[1];
  return fallback ? new URL(fallback).hostname : '';
}

/** §13 performance: no third-party origins and no raster images on pages. */
function checkThirdParty(raw, where, siteHost) {
  const resource = /<(?:script|link|img|iframe|source|video|audio|embed|object)\b[^>]*?\s(?:src|href|srcset|data)="([^"]+)"/gi;
  for (const m of raw.matchAll(resource)) {
    const tag = m[0];
    const url = m[1];
    if (/^<link\b/i.test(tag) && /\brel="(?:canonical|alternate|sitemap)"/i.test(tag)) continue;
    if (/^(?:https?:)?\/\//i.test(url)) {
      const host = new URL(url, 'https://x.invalid').hostname;
      if (host !== siteHost) fail('third-party origin', where, url);
    }
    if (/^<img\b/i.test(tag) && /\.(?:png|jpe?g|webp|gif|avif)(?:[?#]|$)/i.test(url)) fail('raster image', where, url);
  }
  for (const m of raw.matchAll(/url\(\s*['"]?((?:https?:)?\/\/[^'")\s]+)/gi)) {
    if (new URL(m[1], 'https://x.invalid').hostname !== siteHost) fail('third-party origin', where, m[1]);
  }
  for (const m of raw.matchAll(/url\(\s*['"]?([^'")\s]+\.(?:png|jpe?g|webp|gif|avif))/gi)) fail('raster image', where, m[1]);
}

/** Visible text of each article/section chunk that contains a euro price. */
function priceChunks(html) {
  const body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html)
    .replace(/<(script|style|template|select)\b[\s\S]*?<\/\1>/gi, ' ');
  return body
    .split(/<(?:section|article)\b[^>]*>/i)
    .map((part) => normalise(decodeEntities(part.replace(/<[^>]+>/g, ' '))))
    .filter((text) => PRICE_RE.test(text));
}

function checkPage(name, raw, where, vatApplies) {
  const { locale, slug, isHome, is404 } = classify(name);
  const { body, attrs } = visibleCopy(raw);
  const bodyText = body.join('\n');
  const allCopy = [bodyText, ...attrs].join('\n');
  const has = (phrase) => normalise(bodyText.replace(/\n/g, ' ')).toLowerCase().includes(normalise(phrase).toLowerCase());

  // Copy rules on everything a visitor or a crawler reads.
  for (const rule of COPY_RULES) for (const m of allCopy.matchAll(rule.re)) fail(rule.id, where, `"${m[0]}"`);
  if (slug === 'vstats-desktop' || slug === 'vstats-teams') for (const m of allCopy.matchAll(RECORDS_RE)) fail('capture wording', where, `"${m[0]}"`);

  // External links in the page.
  for (const m of raw.matchAll(/\shref="([^"]+)"/gi)) checkExternalUrl(decodeEntities(m[1]), where);

  // §16 Riot disclaimer placement.
  if (!has(DISCLAIMER.siteEn)) fail('riot disclaimer', where, 'footer line (EN) missing');
  if (locale === 'it' && !has(DISCLAIMER.siteIt)) fail('riot disclaimer', where, 'footer line (IT) missing');
  if (isHome && !has(locale === 'it' ? DISCLAIMER.gridIt : DISCLAIMER.gridEn)) fail('riot disclaimer', where, 'grid variant missing under the work grid');
  if (slug && !has(locale === 'it' ? DISCLAIMER.projectIt : DISCLAIMER.projectEn)) fail('riot disclaimer', where, 'project variant missing');

  // §17.3 Beta labels and the Teams billing line.
  if (isHome || slug === 'vstats-desktop') {
    if (!has('1.0.0-beta.6')) fail('beta label', where, 'vStats Desktop version 1.0.0-beta.6 missing');
  }
  if (isHome || slug === 'vstats-teams') {
    if (!has('1.0.0-beta.43')) fail('beta label', where, 'vStats Teams version 1.0.0-beta.43 missing');
  }
  if (slug === 'vstats-desktop' && !/\bwindows\b/i.test(bodyText)) fail('beta label', where, 'Windows-only platform missing');
  if (slug === 'vstats-teams' || isHome) {
    const soon = locale === 'it' ? /abbonamenti (?:a pagamento )?(?:sono )?in arrivo|opening soon/i : /opening soon/i;
    if (!soon.test(bodyText)) fail('teams billing', where, 'Teams billing mentioned without "Subscriptions are opening soon"');
  }

  // §17.4 / §17.8 / §17.9 / §17.5 Required wording on case pages.
  if (slug === 'vstats' && /ARBITER/.test(bodyText) && !has('not cheat detection')) fail('arbiter wording', where, '"not cheat detection" missing');
  if (/ARBITER/.test(bodyText) && !/fair-play/i.test(bodyText)) fail('arbiter wording', where, 'ARBITER named without "fair-play indicator"');
  if (slug === 'vstats-desktop' && !has('read-only')) fail('desktop wording', where, '"read-only" missing');
  if (slug === 'vstats-teams' && !has('captures match data, not video')) fail('teams wording', where, '"captures match data, not video" missing');
  if (slug === 'ivpiter') {
    if (!has('in development and testing') && !has('in sviluppo e test')) fail('ivpiter status', where, '"In development and testing" missing');
    if (!has("built from the client's approved design") && !has('dal design approvato dal cliente')) {
      fail('authorship', where, `"built from the client's approved design" missing`);
    }
  }

  // §17.12 VAT suffix beside every price: each section or card that shows a
  // price must carry the suffix. Meta descriptions follow §14 verbatim,
  // and budget ranges in the brief form are not prices.
  if (vatApplies) {
    for (const chunk of priceChunks(raw)) {
      if (!VAT_SUFFIX.test(chunk)) fail('vat suffix', where, `"${chunk.slice(0, 100)}"`);
    }
  }

  checkHead(raw, where, { is404 });
}

/** §14 meta basics. */
function checkHead(raw, where, { is404 }) {
  const head = raw.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? '';
  const title = decodeEntities(head.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const description = decodeEntities(head.match(/<meta name="description" content="([^"]*)"/i)?.[1] ?? '');
  if (!title) fail('meta', where, '<title> missing');
  if (title.length > 60) fail('meta', where, `title is ${title.length} chars (max 60)`);
  if (description.length > 155) fail('meta', where, `description is ${description.length} chars (max 155)`);
  if (/<meta name="keywords"/i.test(head)) fail('meta', where, 'meta keywords present');
  if (!/<html[^>]+lang="(?:en|it)"/i.test(raw)) fail('meta', where, '<html lang> missing');

  if (is404) {
    if (!/<meta name="robots" content="noindex/i.test(head)) fail('meta', where, '404 page must be noindex');
  } else {
    if (!description) fail('meta', where, 'description missing');
    const canonical = head.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    if (!canonical) fail('meta', where, 'canonical missing');
    else if (!/^https:\/\/.+\/$/.test(canonical)) fail('meta', where, `canonical must be absolute with a trailing slash: ${canonical}`);
    for (const lang of ['en', 'it', 'x-default']) {
      if (!new RegExp(`<link rel="alternate" hreflang="${lang}"`, 'i').test(head)) fail('meta', where, `hreflang ${lang} missing`);
    }
    for (const prop of ['og:title', 'og:description', 'og:image', 'og:locale', 'og:site_name']) {
      if (!new RegExp(`<meta property="${prop}"`, 'i').test(head)) fail('meta', where, `${prop} missing`);
    }
    if (!/<meta name="twitter:card" content="summary_large_image"/i.test(head)) fail('meta', where, 'twitter:card missing');
  }

  for (const m of head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(m[1]);
    } catch (error) {
      fail('json-ld', where, `invalid JSON: ${error.message}`);
    }
  }
}

async function checkDistFiles() {
  for (const file of ['robots.txt', 'sitemap-index.xml', '.nojekyll', 'favicon.svg', 'favicon-32.png', 'apple-touch-icon.png']) {
    if (!(await exists(join(DIST, file)))) fail('build output', `dist/${file}`, 'missing');
  }
  const ogDir = join(DIST, 'og');
  const og = (await exists(ogDir)) ? (await readdir(ogDir)).filter((f) => f.endsWith('.png')) : [];
  if (og.length < 12) fail('og images', 'dist/og/', `expected 12 PNGs, found ${og.length}`);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

if (!(await exists(DIST))) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(2);
}

const siteSource = await readFile(join(ROOT, 'src/data/site.ts'), 'utf8');
const vatApplies = /vatApplies:\s*true/.test(siteSource);
if (/vatNumber:\s*''/.test(siteSource)) warn('launch blocker', 'src/data/site.ts', 'vatNumber (P.IVA) is empty');
if (/businessAddress:\s*''/.test(siteSource)) warn('launch blocker', 'src/data/site.ts', 'businessAddress is empty');

await checkSources();
await checkDist(vatApplies);
await checkDistFiles();

const print = (items) => {
  const byRule = Map.groupBy ? Map.groupBy(items, (i) => i.rule) : items.reduce((m, i) => m.set(i.rule, [...(m.get(i.rule) ?? []), i]), new Map());
  for (const [rule, list] of byRule) {
    console.log(`\n  ${rule} (${list.length})`);
    for (const item of list) console.log(`    ${item.where}  ${item.detail}`);
  }
};

if (warnings.length) {
  console.log(`Warnings: ${warnings.length}`);
  print(warnings);
}
if (failures.length) {
  console.log(`\nCompliance check failed: ${failures.length} problem(s).`);
  print(failures);
  process.exit(1);
}
console.log('\nCompliance check passed.');
