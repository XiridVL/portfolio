/**
 * Open Graph image rendering (spec §14): 1200×630 PNGs drawn as SVG and
 * rasterised with resvg at build time, using the site's own fonts.
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
  heading: 'Bricolage Grotesque',
  mono: 'IBM Plex Mono',
} as const;

const require = createRequire(import.meta.url);

/** WOFF sources: package + file, resolved through node_modules. */
const SOURCES = [
  ['@fontsource/bricolage-grotesque', 'bricolage-grotesque-latin-700-normal.woff'],
  ['@fontsource/bricolage-grotesque', 'bricolage-grotesque-latin-ext-700-normal.woff'],
  ['@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff'],
  ['@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-ext-400-normal.woff'],
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

let fontFiles: string[] | undefined;

/** Unwrap the OG fonts into node_modules/.cache once and return their paths. */
function ogFontFiles(): string[] {
  if (fontFiles) return fontFiles;
  const cacheDir = join(process.cwd(), 'node_modules', '.cache', 'og-fonts');
  mkdirSync(cacheDir, { recursive: true });
  fontFiles = SOURCES.map(([pkg, file]) => {
    const pkgDir = dirname(require.resolve(`${pkg}/package.json`));
    const target = join(cacheDir, file.replace(/\.woff$/, '.ttf'));
    writeFileSync(target, woffToSfnt(readFileSync(join(pkgDir, 'files', file))));
    return target;
  });
  return fontFiles;
}

/** Rasterise an OG SVG to PNG with the bundled fonts only. */
export function renderOgPng(svg: string): Uint8Array {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: OG_WIDTH },
    font: { loadSystemFonts: false, fontFiles: ogFontFiles(), defaultFontFamily: OG_FONTS.mono },
  });
  return resvg.render().asPng();
}
