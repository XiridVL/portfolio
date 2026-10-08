/**
 * AC monogram geometry (spec §8.4), shared by Monogram.astro and the PNG
 * renderers (favicon fallbacks, OG images). 64×64 viewBox.
 */
export const MONOGRAM = {
  /** A: apex (23,8), feet (6,56) and (40,56); no crossbar. */
  a: 'M6 56L23 8L40 56',
  /** C: 270° arc centred at (42,34), r 16, opening to the right (gap −45°…45°). */
  c: 'M53.31 45.31A16 16 0 1 1 53.31 22.69',
  /** Crossbar = horizon, y 37 from x 12 to x 62. */
  bar: 'M12 37H62',
  letterStroke: 9,
} as const;

export const MONOGRAM_COLORS = {
  light: { ink: '#0E1A1F', buoy: '#B07400', bg: '#F3F1EA' },
  dark: { ink: '#E6EBE8', buoy: '#F2B43C', bg: '#0A1316' },
} as const;

/** The monogram as SVG group markup (no <svg> wrapper), in a 64×64 coordinate space. */
export function monogramGroup({ ink, buoy, barWidth = 6 }: { ink: string; buoy: string; barWidth?: number }): string {
  const { a, c, bar, letterStroke } = MONOGRAM;
  return (
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    `<g stroke="${ink}" stroke-width="${letterStroke}"><path d="${a}"/><path d="${c}"/></g>` +
    `<path d="${bar}" stroke="${buoy}" stroke-width="${barWidth}"/></g>`
  );
}

/** Standalone light-theme SVG for raster icons, optionally on a solid background with padding. */
export function monogramSvg({ size, background, padding = 0 }: { size: number; background?: string; padding?: number }): string {
  const { ink, buoy } = MONOGRAM_COLORS.light;
  const inner = 64 + padding * 2;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-padding} ${-padding} ${inner} ${inner}">` +
    (background ? `<rect x="${-padding}" y="${-padding}" width="${inner}" height="${inner}" fill="${background}"/>` : '') +
    monogramGroup({ ink, buoy }) +
    `</svg>`
  );
}
