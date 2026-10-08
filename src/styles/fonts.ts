/**
 * Self-hosted fonts (latin + latin-ext only). URLs are resolved by Vite so they
 * are hashed and respect the configured base path.
 *
 * Font budget (.github/lighthouse/lighthouserc.json): 95 KB for every face a
 * page loads. Four latin files stay under it: Bricolage (headings), Plex Sans
 * 400 and 600, Plex Mono 400. There is no 500 weight: medium text uses 400 or
 * 600 so two more files are never downloaded.
 *
 * Bricolage (latin) is a subset with the weight axis limited to 600-800 and
 * only the characters headings use (~29 KB instead of ~41 KB); it is built by
 * scripts/subset-display-font.py. Latin-ext keeps the stock fontsource file.
 */
import bricolageLatin from '../assets/fonts/bricolage-grotesque-latin-wght600-800-subset.woff2?url';
import bricolageLatinExt from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-ext-wght-normal.woff2?url';
import sans400 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2?url';
import sans400Ext from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-ext-400-normal.woff2?url';
import sans600 from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2?url';
import sans600Ext from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-ext-600-normal.woff2?url';
import mono400 from '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2?url';
import mono400Ext from '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-ext-400-normal.woff2?url';

const LATIN =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';
/** Characters in the Bricolage latin subset (keep in sync with scripts/subset-display-font.py). */
const DISPLAY_RANGE =
  'U+0020-007E,U+00A0-00FF,U+00B7,U+2013-2014,U+2018-201D,U+2022,U+2026,U+20AC,U+2192-2193,U+2197';
const LATIN_EXT =
  'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF';

interface Face {
  family: string;
  weight: string;
  src: string;
  range: string;
}

const faces: Face[] = [
  // Both Bricolage faces must declare the same weight range: Chrome only combines
  // unicode-range faces whose descriptors match, so a 200-800 face would hide this one.
  { family: 'Bricolage Grotesque Variable', weight: '600 800', src: bricolageLatinExt, range: LATIN_EXT },
  { family: 'Bricolage Grotesque Variable', weight: '600 800', src: bricolageLatin, range: DISPLAY_RANGE },
  { family: 'IBM Plex Sans', weight: '400', src: sans400Ext, range: LATIN_EXT },
  { family: 'IBM Plex Sans', weight: '400', src: sans400, range: LATIN },
  { family: 'IBM Plex Sans', weight: '600', src: sans600Ext, range: LATIN_EXT },
  { family: 'IBM Plex Sans', weight: '600', src: sans600, range: LATIN },
  { family: 'IBM Plex Mono', weight: '400', src: mono400Ext, range: LATIN_EXT },
  { family: 'IBM Plex Mono', weight: '400', src: mono400, range: LATIN },
];

export const fontFaceCss = faces
  .map(
    (f) =>
      `@font-face{font-family:"${f.family}";font-style:normal;font-display:swap;font-weight:${f.weight};` +
      `src:url(${f.src}) format("woff2");unicode-range:${f.range}}`,
  )
  .join('');

/** The two files preloaded on every page (spec §8.3). */
export const fontPreloads: string[] = [bricolageLatin, sans400];
