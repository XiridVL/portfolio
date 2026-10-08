/**
 * OG images (1200×630) for every route and locale: /og/{locale}-{routeKey}.png.
 * The site's warm dark card: #121212, a soft clay glow top-right with a faint
 * ivory light beside it, a hairline grid fading out from that corner, the AC
 * mark, the page title in Inter (the home title keeps its italic serif accent
 * word) and a subtitle led by a clay dot, or a clay BETA chip on beta pages.
 * Rendered with resvg using the bundled Inter and Instrument Serif files (see
 * src/lib/og.ts); no system fonts.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { pageMeta } from '../../data/meta';
import { projects } from '../../data/projects';
import { site } from '../../data/site';
import { homeCopy } from '../../i18n/home';
import { MONOGRAM_COLORS, monogramGroup } from '../../lib/monogram';
import { pngResponse } from '../../lib/raster';
import { OG_FONTS, OG_HEIGHT as H, OG_WIDTH as W, measureText, renderOgPng } from '../../lib/og';
import { locales, routes, useStrings, type Locale, type RouteKey } from '../../i18n';

export const getStaticPaths = (() =>
  locales.flatMap((locale) =>
    (Object.keys(routes) as RouteKey[]).map((key) => ({ params: { image: `${locale}-${key}` }, props: { locale, key } })),
  )) satisfies GetStaticPaths;

const { ink, accent, bg } = MONOGRAM_COLORS;
const MUTED = '#A39E93';
const M = 80; // outer margin; the grid shares this 80px rhythm
const TITLE = { size: 72, tracking: -2.5, leading: 78, maxWidth: W - 2 * M, baseline: 464 };
const SUB = { size: 26, baseline: 548 };

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const titleWidth = (s: string) => measureText(s, { face: 'bold', size: TITLE.size, tracking: TITLE.tracking });

/** Greedy word wrap to a pixel width. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && titleWidth(next) > max) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Title lines: break after a colon when both halves fit ("vStats Desktop (Beta):"
 * / "Tauri & Rust"); otherwise the narrowest width that keeps the greedy line
 * count, like CSS `text-wrap: balance`. At most three lines.
 */
function titleLines(title: string): string[] {
  const colon = title.indexOf(': ');
  if (colon > 0) {
    const pair = [title.slice(0, colon + 1), title.slice(colon + 2)];
    if (pair.every((l) => titleWidth(l) <= TITLE.maxWidth)) return pair;
  }
  const count = wrap(title, TITLE.maxWidth).length;
  let width = TITLE.maxWidth;
  while (width > 200 && wrap(title, width - 8).length === count) width -= 8;
  return wrap(title, width).slice(0, 3);
}

/** One title line as SVG text, with the accent word (if it falls on this line) in italic serif clay. */
function lineMarkup(line: string, word?: string): string {
  const at = word ? line.indexOf(word) : -1;
  if (!word || at < 0) return escape(line);
  const serif = `<tspan font-family="${OG_FONTS.serif}" font-style="italic" font-weight="400" font-size="${Math.round(TITLE.size * 1.08)}" letter-spacing="-.6" fill="${accent}">${escape(word)}</tspan>`;
  return escape(line.slice(0, at)) + serif + escape(line.slice(at + word.length));
}

/** Hairline grid on the 80px rhythm; the mask fades it out away from the glow. */
const grid = [
  ...Array.from({ length: W / M - 1 }, (_, i) => `M${(i + 1) * M + 0.5} 0V${H}`),
  ...Array.from({ length: Math.floor(H / M) }, (_, i) => `M0 ${(i + 1) * M + 0.5}H${W}`),
].join('');

export const GET: APIRoute = ({ props }) => {
  const { locale, key } = props as { locale: Locale; key: RouteKey };
  const meta = pageMeta[key][locale];
  const version = projects.find((p) => p.slug === key)?.softwareVersion;

  // Home keeps the hero's italic serif word; the first line holding it gets it.
  let word: string | undefined = key === 'home' ? homeCopy[locale].hero.titleAccent : undefined;
  const lines = titleLines(meta.ogTitle).map((line) => {
    const markup = lineMarkup(line, word);
    if (word && line.includes(word)) word = undefined;
    return markup;
  });
  const firstBaseline = TITLE.baseline - (lines.length - 1) * TITLE.leading;

  // Subtitle row: clay dot + "Name · role", or a clay BETA chip + "version · Windows · Name".
  const capMid = SUB.baseline - 9.5;
  let lead: string;
  let subX: number;
  let subtitle: string;
  if (version) {
    const chip = { size: 17, tracking: 1.7, padX: 14, h: 34 };
    const chipW = Math.round(measureText('BETA', { face: 'bold', size: chip.size, tracking: chip.tracking }) - chip.tracking + chip.padX * 2);
    lead =
      `<rect x="${M}" y="${capMid - chip.h / 2}" width="${chipW}" height="${chip.h}" rx="${chip.h / 2}" fill="${accent}" fill-opacity=".13" stroke="${accent}" stroke-opacity=".38"/>` +
      `<text x="${M + chip.padX}" y="${capMid + 6.2}" font-size="${chip.size}" font-weight="700" letter-spacing="${chip.tracking}" fill="${accent}">BETA</text>`;
    subX = M + chipW + 16;
    subtitle = escape(`${version} · Windows · ${site.name}`);
  } else {
    lead = `<circle cx="${M + 4.5}" cy="${capMid}" r="4.5" fill="${accent}"/>`;
    subX = M + 9 + 16;
    subtitle = `<tspan fill="${ink}">${escape(site.name)}</tspan> · ${escape(useStrings(locale).footer.role)}`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${OG_FONTS.sans}">
  <defs>
    <radialGradient id="ember" cx="1010" cy="-30" r="780" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${accent}" stop-opacity=".42"/>
      <stop offset=".3" stop-color="${accent}" stop-opacity=".17"/>
      <stop offset=".66" stop-color="#A8743F" stop-opacity=".05"/>
      <stop offset="1" stop-color="#A8743F" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="halo" cx="600" cy="-170" r="520" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${ink}" stop-opacity=".09"/>
      <stop offset="1" stop-color="${ink}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fade" cx="1060" cy="40" r="860" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff"/>
      <stop offset=".5" stop-color="#fff" stop-opacity=".3"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="grid-fade" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <rect width="${W}" height="${H}" fill="url(#fade)"/>
    </mask>
  </defs>
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect width="${W}" height="${H}" fill="url(#halo)"/>
  <rect width="${W}" height="${H}" fill="url(#ember)"/>
  <path d="${grid}" stroke="${ink}" stroke-opacity=".075" mask="url(#grid-fade)"/>
  <g transform="translate(${M - 1.5} ${M - 3.5})">${monogramGroup()}</g>
  <text x="${M}" y="${firstBaseline}" font-size="${TITLE.size}" font-weight="700" letter-spacing="${TITLE.tracking}" fill="${ink}">${lines
    .map((l, i) => `<tspan x="${M}" dy="${i === 0 ? 0 : TITLE.leading}">${l}</tspan>`)
    .join('')}</text>
  ${lead}
  <text x="${subX}" y="${SUB.baseline}" font-size="${SUB.size}" font-weight="400" fill="${MUTED}">${subtitle}</text>
</svg>`;

  return pngResponse(renderOgPng(svg));
};
