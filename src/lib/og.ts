/**
 * Open Graph image rendering: 1200×630 PNGs drawn as SVG and rasterised with
 * resvg at build time, using the site's own typefaces (Inter, Instrument Serif).
 *
 * resvg reads TrueType/OpenType files only, so the self-hosted WOFF files from
 * the @fontsource packages are unwrapped to plain sfnt (zlib per table) into a
 * cache folder once per build. No system fonts are loaded: the images look the
 * same on every machine and in CI.
 */
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { inflateSync } from 'node:zlib';
import { Resvg } from '@resvg/resvg-js';
import { OG_WIDTH } from './seo';

export { OG_HEIGHT, OG_WIDTH } from './seo';

/** Family names as stored in the font files (used in the SVG font-family attributes). */
export const OG_FONTS = {
  sans: 'Inter',
  serif: 'Instrument Serif',
} as const;

const require = createRequire(import.meta.url);

/** WOFF sources: package + file, resolved through node_modules. Inter 400/700, serif italic. */
const SOURCES = [
  ['@fontsource/inter', 'inter-latin-400-normal.woff'],
  ['@fontsource/inter', 'inter-latin-ext-400-normal.woff'],
  ['@fontsource/inter', 'inter-latin-700-normal.woff'],
  ['@fontsource/inter', 'inter-latin-ext-700-normal.woff'],
  ['@fontsource/instrument-serif', 'instrument-serif-latin-400-italic.woff'],
  ['@fontsource/instrument-serif', 'instrument-serif-latin-ext-400-italic.woff'],
] as const;

/** Convert a WOFF 1.0 file to the TrueType/OpenType font it wraps. */
export function woffToSfnt(woff: Buffer): Buffer {
  if (woff.toString('ascii', 0, 4) !== 'wOFF') throw new Error('Not a WOFF 1.0 file');
  const flavor = woff.readUInt32BE(4);
  const numTables = woff.readUInt16BE(12);

  const tables = Array.from({ length: numTables }, (_, i) => {
    const entry = 44 + i * 20;
    const tag = woff.readUInt32BE(entry);
    const offset = woff.readUInt32BE(entry + 4);
    const compLength = woff.readUInt32BE(entry + 8);
    const origLength = woff.readUInt32BE(entry + 12);
    const checksum = woff.readUInt32BE(entry + 16);
    const raw = woff.subarray(offset, offset + compLength);
    const data = compLength < origLength ? inflateSync(raw) : raw;
    return { tag, checksum, data };
  });

  // sfnt offset table: searchRange etc. per the OpenType spec.
  const maxPow2 = 2 ** Math.floor(Math.log2(numTables));
  const header = Buffer.alloc(12 + numTables * 16);
  header.writeUInt32BE(flavor, 0);
  header.writeUInt16BE(numTables, 4);
  header.writeUInt16BE(maxPow2 * 16, 6);
  header.writeUInt16BE(Math.log2(maxPow2), 8);
  header.writeUInt16BE(numTables * 16 - maxPow2 * 16, 10);

  const chunks: Buffer[] = [header];
  let offset = header.length;
  tables.forEach((table, i) => {
    const dir = 12 + i * 16;
    header.writeUInt32BE(table.tag, dir);
    header.writeUInt32BE(table.checksum, dir + 4);
    header.writeUInt32BE(offset, dir + 8);
    header.writeUInt32BE(table.data.length, dir + 12);
    const padded = Buffer.alloc((table.data.length + 3) & ~3);
    table.data.copy(padded);
    chunks.push(padded);
    offset += padded.length;
  });
  return Buffer.concat(chunks);
}

let fonts: Map<string, { path: string; data: Buffer }> | undefined;

/** Unwrap the OG fonts into node_modules/.cache once; keyed by source file name. */
function ogFonts() {
  if (fonts) return fonts;
  const cacheDir = join(process.cwd(), 'node_modules', '.cache', 'og-fonts');
  mkdirSync(cacheDir, { recursive: true });
  fonts = new Map(
    SOURCES.map(([pkg, file]) => {
      const pkgDir = dirname(require.resolve(`${pkg}/package.json`));
      const path = join(cacheDir, file.replace(/\.woff$/, '.ttf'));
      const data = woffToSfnt(readFileSync(join(pkgDir, 'files', file)));
      writeFileSync(path, data);
      return [file, { path, data }] as const;
    }),
  );
  return fonts;
}

/** Horizontal advance (font units) per code point, from the cmap (format 4) and hmtx tables. */
function advances(font: Buffer): { upm: number; advance: (cp: number) => number } {
  const table: Record<string, number> = {};
  for (let i = 0, n = font.readUInt16BE(4); i < n; i++) {
    const dir = 12 + i * 16;
    table[font.toString('ascii', dir, dir + 4)] = font.readUInt32BE(dir + 8);
  }
  const upm = font.readUInt16BE(table.head + 18);
  const hMetrics = font.readUInt16BE(table.hhea + 34);
  let sub = 0;
  for (let i = 0, n = font.readUInt16BE(table.cmap + 2); i < n; i++) {
    const rec = table.cmap + 4 + i * 8;
    if (font.readUInt16BE(rec) === 3 && font.readUInt16BE(rec + 2) === 1) sub = table.cmap + font.readUInt32BE(rec + 4);
  }
  const segs = font.readUInt16BE(sub + 6) / 2;
  const ends = sub + 14, starts = ends + segs * 2 + 2, deltas = starts + segs * 2, ranges = deltas + segs * 2;
  const glyph = (cp: number) => {
    for (let s = 0; s < segs; s++) {
      if (cp > font.readUInt16BE(ends + s * 2)) continue;
      const start = font.readUInt16BE(starts + s * 2);
      if (cp < start) return 0;
      const delta = font.readUInt16BE(deltas + s * 2);
      const range = font.readUInt16BE(ranges + s * 2);
      if (!range) return (cp + delta) & 0xffff;
      const id = font.readUInt16BE(ranges + s * 2 + range + (cp - start) * 2);
      return id ? (id + delta) & 0xffff : 0;
    }
    return 0;
  };
  return { upm, advance: (cp) => font.readUInt16BE(table.hmtx + Math.min(glyph(cp), hMetrics - 1) * 4) };
}

const FACES = {
  regular: 'inter-latin-400-normal.woff',
  bold: 'inter-latin-700-normal.woff',
  italic: 'instrument-serif-latin-400-italic.woff',
} as const;
const metrics = new Map<keyof typeof FACES, ReturnType<typeof advances>>();

/**
 * Width in px of a single line of text, without kerning (so slightly generous):
 * enough to wrap titles and place inline pieces on the OG cards.
 */
export function measureText(text: string, { face = 'regular', size, tracking = 0 }: { face?: keyof typeof FACES; size: number; tracking?: number }): number {
  if (!metrics.has(face)) metrics.set(face, advances(ogFonts().get(FACES[face])!.data));
  const { upm, advance } = metrics.get(face)!;
  const chars = [...text];
  const units = chars.reduce((sum, ch) => sum + advance(ch.codePointAt(0)!), 0);
  return (units / upm) * size + tracking * chars.length;
}

/** Rasterise an OG SVG to PNG with the bundled fonts only. */
export function renderOgPng(svg: string): Uint8Array {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: OG_WIDTH },
    font: { loadSystemFonts: false, fontFiles: [...ogFonts().values()].map((f) => f.path), defaultFontFamily: OG_FONTS.sans },
  });
  return resvg.render().asPng();
}
