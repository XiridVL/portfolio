/**
 * AC monogram geometry, shared by Monogram.astro and the PNG renderers
 * (favicon fallbacks, OG images). 64×64 viewBox. Ivory letters, clay crossbar.
 */
export const MONOGRAM = {
  /** A: apex (23,8), feet (6,56) and (40,56); no crossbar of its own. */
  a: 'M6 56L23 8L40 56',
  /** C: 270° arc centred at (42,34), r 16, opening to the right (gap −45°…45°). */
  c: 'M53.31 45.31A16 16 0 1 1 53.31 22.69',
  /** Shared crossbar, y 37 from x 12 to x 62: through the A's legs and the C's opening. */
  bar: 'M12 37H62',
  letterStroke: 9,
} as const;

/** The site palette (tokens.css): --ink, --accent, --bg. */
export const MONOGRAM_COLORS = { ink: '#F2EFE8', accent: '#D9A066', bg: '#121212' } as const;

/**
 * Icon tile: the mark scaled into a 64-unit square. The stroked mark spans
 * x 1.5–65 and y 3.5–60.5, so this centres it with even optical padding.
 * Letters and bar are a touch heavier than the base mark so they hold at 16px.
 */
export const ICON = {
  scale: 0.7,
  translate: [8.7, 9.6],
  letterStroke: 10,
  barWidth: 7,
  /** Corner radius of the rounded-square favicon (64-unit space). */
  radius: 14,
} as const;

interface GroupOptions {
  ink?: string;
  accent?: string;
  barWidth?: number;
  letterStroke?: number;
}

/** The monogram as SVG group markup (no <svg> wrapper), in a 64×64 coordinate space. */
export function monogramGroup({
  ink = MONOGRAM_COLORS.ink,
  accent = MONOGRAM_COLORS.accent,
  barWidth = 6,
  letterStroke = MONOGRAM.letterStroke,
}: GroupOptions = {}): string {
  const { a, c, bar } = MONOGRAM;
  return (
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    `<g stroke="${ink}" stroke-width="${letterStroke}"><path d="${a}"/><path d="${c}"/></g>` +
    `<path d="${bar}" stroke="${accent}" stroke-width="${barWidth}"/></g>`
  );
}

/**
 * Standalone app-icon SVG: the mark on a #121212 tile. `rounded` gives the
 * favicon's rounded square; leave it off for the full-bleed Apple touch icon
 * (iOS applies its own mask and fills transparent corners with black).
 */
export function monogramSvg({ size, rounded = true }: { size: number; rounded?: boolean }): string {
  const { scale, translate, letterStroke, barWidth, radius } = ICON;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">` +
    `<rect width="64" height="64"${rounded ? ` rx="${radius}"` : ''} fill="${MONOGRAM_COLORS.bg}"/>` +
    `<g transform="translate(${translate.join(' ')}) scale(${scale})">${monogramGroup({ letterStroke, barWidth })}</g>` +
    `</svg>`
  );
}
