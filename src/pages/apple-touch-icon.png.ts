/** Apple touch icon (180×180): the favicon tile, full bleed so iOS can apply its own mask. */
import type { APIRoute } from 'astro';
import { monogramSvg } from '../lib/monogram';
import { pngResponse, svgToPng } from '../lib/raster';

export const GET: APIRoute = () => pngResponse(svgToPng(monogramSvg({ size: 180, rounded: false }), 180));
