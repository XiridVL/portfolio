/**
 * OG images (1200×630) for every route and locale: /og/{locale}-{routeKey}.png.
 * Salt background, static contours, the AC mark, the page title, a mono
 * subtitle (with the BETA version on beta pages) and the horizon rule + buoy dot.
 * Rendered with resvg using the bundled Bricolage Grotesque and IBM Plex Mono
 * files (see src/lib/og.ts); no system fonts.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { pageMeta } from '../../data/meta';
import { projects } from '../../data/projects';
import { site } from '../../data/site';
import { contourPaths } from '../../lib/contours';
import { MONOGRAM_COLORS, monogramGroup } from '../../lib/monogram';
import { pngResponse } from '../../lib/raster';
import { OG_FONTS, OG_HEIGHT as H, OG_WIDTH as W, renderOgPng } from '../../lib/og';
import { locales, routes, useStrings, type Locale, type RouteKey } from '../../i18n';

export const getStaticPaths = (() =>
  locales.flatMap((locale) =>
    (Object.keys(routes) as RouteKey[]).map((key) => ({ params: { image: `${locale}-${key}` }, props: { locale, key } })),
  )) satisfies GetStaticPaths;

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy word wrap by character budget. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && (line + ' ' + word).length > max) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}

export const GET: APIRoute = ({ props }) => {
  const { locale, key } = props as { locale: Locale; key: RouteKey };
  const meta = pageMeta[key][locale];
  const { ink, buoy, bg } = MONOGRAM_COLORS.light;
  const muted = '#4A5A5E';
  const project = projects.find((p) => p.slug === key);
  const role = `${site.name} — ${useStrings(locale).footer.role}`;
  const subtitle = project?.softwareVersion ? `BETA ${project.softwareVersion} · Windows · ${site.name}` : role;
  const lines = wrap(meta.ogTitle, 26).slice(0, 3);
  const contours = contourPaths({ width: W, height: H, cx: 0.82, cy: 0.35, levels: 7 })
    .map((d) => `<path d="${d}"/>`)
    .join('');
  const titleY = 330 - (lines.length - 1) * 38;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <g fill="none" stroke="${ink}" stroke-opacity=".12" stroke-width="1.5">${contours}</g>
  <g transform="translate(80 72) scale(1.25)">${monogramGroup({ ink, buoy, barWidth: 5 })}</g>
  <text x="80" y="${titleY}" font-family="${OG_FONTS.heading}" font-size="68" font-weight="700" fill="${ink}" letter-spacing="-1">
    ${lines.map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 76}">${escape(l)}</tspan>`).join('')}
  </text>
  <line x1="0" y1="500" x2="${W}" y2="500" stroke="${ink}" stroke-width="3"/>
  <circle cx="84" cy="500" r="8" fill="${buoy}"/>
  <text x="80" y="556" font-family="${OG_FONTS.mono}" font-size="24" letter-spacing="1" fill="${muted}">${escape(subtitle)}</text>
</svg>`;

  return pngResponse(renderOgPng(svg));
};
