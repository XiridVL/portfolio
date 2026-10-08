import type { APIRoute } from 'astro';
import { MONOGRAM_COLORS, monogramSvg } from '../lib/monogram';
import { pngResponse, svgToPng } from '../lib/raster';

export const GET: APIRoute = () =>
  pngResponse(svgToPng(monogramSvg({ size: 180, background: MONOGRAM_COLORS.light.bg, padding: 14 }), 180));
