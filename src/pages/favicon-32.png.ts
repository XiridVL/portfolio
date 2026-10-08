import type { APIRoute } from 'astro';
import { monogramSvg } from '../lib/monogram';
import { pngResponse, svgToPng } from '../lib/raster';

export const GET: APIRoute = () => pngResponse(svgToPng(monogramSvg({ size: 32, padding: 2 }), 32));
