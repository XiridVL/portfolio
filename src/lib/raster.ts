/**
 * Build-time SVG → PNG rendering for the icon endpoints (static only).
 * Icons carry no text, so no fonts are loaded: output is identical on every
 * machine and in CI. OG images (which do set text) go through src/lib/og.ts.
 */
import { Resvg } from '@resvg/resvg-js';

export function svgToPng(svg: string, width: number): Uint8Array {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: false },
  });
  return resvg.render().asPng();
}

export function pngResponse(png: Uint8Array): Response {
  return new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png' } });
}
