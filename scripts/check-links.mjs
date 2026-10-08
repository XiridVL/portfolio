#!/usr/bin/env node
// Checks every internal link and fragment in the built site.
// Usage: npm run build && npm run check:links
// Honours BASE_PATH the same way astro.config.mjs does, so a project-page
// build ('/<repo>/') is checked against the prefixed URLs.

import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const base = normaliseBase(process.env.BASE_PATH ?? '/');

/** Routes from the sitemap in the spec; each must exist in dist/. */
const requiredRoutes = [
  '/',
  '/work/vstats/',
  '/work/vstats-desktop/',
  '/work/vstats-teams/',
  '/work/ivpiter/',
  '/privacy/',
  '/404.html',
  '/it/',
  '/it/lavori/vstats/',
  '/it/lavori/vstats-desktop/',
  '/it/lavori/vstats-teams/',
  '/it/lavori/ivpiter/',
  '/it/privacy/',
  '/sitemap-index.xml',
  '/robots.txt',
  '/favicon.svg',
  '/favicon-32.png',
  '/apple-touch-icon.png',
];

/** Anchor ids that both home pages must carry. */
const homeAnchors = ['top', 'proof', 'work', 'services', 'process', 'about', 'faq', 'contact'];

function normaliseBase(value) {
  let b = value.trim() || '/';
  if (!b.startsWith('/')) b = `/${b}`;
  if (!b.endsWith('/')) b = `${b}/`;
  return b;
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** Turns a dist file path into the URL path it is served at (without base). */
function fileToUrl(file) {
  const rel = relative(root, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

/** Resolves a site path (without base) to a file in dist/, or null. */
async function resolveFile(path) {
  const clean = decodeURIComponent(path);
  const candidates = clean.endsWith('/')
    ? [join(root, clean, 'index.html')]
    : [join(root, clean), join(root, clean, 'index.html')];
  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

function collectIds(html) {
  const ids = new Set();
  for (const m of html.matchAll(/\s(?:id|name)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    ids.add(m[1] ?? m[2]);
  }
  return ids;
}

function collectRefs(html) {
  // Drop scripts and inline SVG <use> references to local defs handled separately.
  const stripped = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  const refs = [];
  const attr = /<(a|link|img|script|source|use|image|area|form|iframe)\b[^>]*?\s(href|src|srcset|action|xlink:href)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  for (const m of stripped.matchAll(attr)) {
    const tag = m[1].toLowerCase();
    const name = m[2].toLowerCase();
    const value = (m[3] ?? m[4] ?? '').trim();
    if (name === 'srcset') {
      for (const part of value.split(',')) {
        const url = part.trim().split(/\s+/)[0];
        if (url) refs.push({ tag, url });
      }
    } else {
      refs.push({ tag, url: value });
    }
  }
  // CSS url(...) inside inline style blocks/attributes.
  for (const m of stripped.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)) {
    refs.push({ tag: 'css', url: m[1] });
  }
  return refs;
}

const isExternal = (url) => /^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith('//');

const errors = [];
const files = await walk(root);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const idCache = new Map();

async function idsFor(file) {
  if (!idCache.has(file)) idCache.set(file, collectIds(await readFile(file, 'utf8')));
  return idCache.get(file);
}

for (const route of requiredRoutes) {
  if (!(await resolveFile(route))) errors.push(`missing route: ${route}`);
}

for (const home of ['/', '/it/']) {
  const file = await resolveFile(home);
  if (!file) continue;
  const ids = await idsFor(file);
  for (const anchor of homeAnchors) {
    if (!ids.has(anchor)) errors.push(`${home}: missing anchor #${anchor}`);
  }
}

let checked = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const pageUrl = `${base}${fileToUrl(file).slice(1)}`;
  const label = relative(root, file);

  for (const { tag, url } of collectRefs(html)) {
    if (!url || url.startsWith('data:') || url.startsWith('mailto:') || url.startsWith('tel:')) continue;
    if (url.startsWith('javascript:')) {
      errors.push(`${label}: javascript: URL in <${tag}>`);
      continue;
    }
    if (isExternal(url)) continue;
    checked += 1;

    const resolved = new URL(url, `http://site.invalid${pageUrl}`);
    const fragment = decodeURIComponent(resolved.hash.slice(1));
    let path = resolved.pathname;

    if (!path.startsWith(base)) {
      errors.push(`${label}: <${tag}> ${url} is outside the base path ${base}`);
      continue;
    }
    path = `/${path.slice(base.length)}`;

    const target = await resolveFile(path);
    if (!target) {
      errors.push(`${label}: <${tag}> ${url} -> no file for ${path}`);
      continue;
    }
    if (tag === 'a' && target.endsWith('.html') && !path.endsWith('/') && !path.endsWith('.html')) {
      errors.push(`${label}: ${url} lacks a trailing slash (trailingSlash: 'always')`);
    }
    if (fragment && target.endsWith('.html')) {
      const ids = await idsFor(target);
      if (!ids.has(fragment)) errors.push(`${label}: ${url} -> #${fragment} not found in ${relative(root, target)}`);
    }
  }

  // aria-* id references inside the page must exist too.
  const ids = await idsFor(file);
  for (const m of html.matchAll(/\saria-(?:describedby|labelledby|controls)\s*=\s*"([^"]*)"/g)) {
    for (const id of m[1].split(/\s+/).filter(Boolean)) {
      if (!ids.has(id)) errors.push(`${label}: aria reference to missing id "${id}"`);
    }
  }
}

if (errors.length) {
  console.error(`Link check failed (${errors.length}):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(`Link check passed: ${htmlFiles.length} pages, ${checked} internal references, base ${base}.`);
