/**
 * Self-hosted fonts (latin + latin-ext only). URLs are resolved by Vite so they
 * are hashed and respect the configured base path.
 *
 * Font budget (.github/lighthouse/lighthouserc.json): 95 KB for every face a
 * page loads. Two latin files cover the whole design:
 *   Inter Variable (wght 100-900)  ~48 KB  headings, body, labels, figures
 *   Instrument Serif Italic         ~22 KB  italic accent words in headlines
 * Monospace uses the system stack (--font-mono), so it costs nothing.
 * Latin-ext files load only for characters outside Latin-1, which the copy
 * (English and Italian) does not use.
 *
 * Inter swaps in over a metric-matched fallback (global.css). The serif uses
 * font-display: optional: accent words sit inside headlines, so a late swap
 * would reflow the line; when it misses the first paint the fallback italic
 * stays for that page view and the cached file is used from the next one.
 */
import interLatin from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url';
import interLatinExt from '@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2?url';
import serifItalic from '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2?url';
import serifItalicExt from '@fontsource/instrument-serif/files/instrument-serif-latin-ext-400-italic.woff2?url';

const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
const LATIN_EXT =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

interface Face {
  family: string;
  style: 'normal' | 'italic';
  weight: string;
  display: 'swap' | 'optional';
  src: string;
  range: string;
}

const faces: Face[] = [
  { family: 'Inter Variable', style: 'normal', weight: '100 900', display: 'swap', src: interLatinExt, range: LATIN_EXT },
  { family: 'Inter Variable', style: 'normal', weight: '100 900', display: 'swap', src: interLatin, range: LATIN },
  { family: 'Instrument Serif', style: 'italic', weight: '400', display: 'optional', src: serifItalicExt, range: LATIN_EXT },
  { family: 'Instrument Serif', style: 'italic', weight: '400', display: 'optional', src: serifItalic, range: LATIN },
];

export const fontFaceCss = faces
  .map(
    (f) =>
      `@font-face{font-family:"${f.family}";font-style:${f.style};font-display:${f.display};font-weight:${f.weight};` +
      `src:url(${f.src}) format("woff2");unicode-range:${f.range}}`,
  )
  .join('');

/** The two files preloaded on every page. */
export const fontPreloads: string[] = [interLatin, serifItalic];
