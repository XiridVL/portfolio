/** Build-time SVG → PNG rendering for icons and OG images (static endpoints only). */
import { Resvg } from '@resvg/resvg-js';

export function svgToPng(svg: string, width: number): Uint8Array {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true, defaultFontFamily: 'DejaVu Sans' },
  });
  return resvg.render().asPng();
}

export function pngResponse(png: Uint8Array): Response {
  return new Response(png as BodyInit, { headers: { 'Content-Type': 'image/png' } });
}
