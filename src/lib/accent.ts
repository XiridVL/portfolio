/**
 * Headline accent words: one word (or short phrase) of a headline is set in
 * italic serif. The copy stays a plain string; the accent is named separately
 * so the visible text, meta tags and JSON-LD never carry markup.
 *
 *   accentParts('Real products, live or in beta', 'live')
 *   // → { before: 'Real products, ', word: 'live', after: ' or in beta' }
 *
 * A missing accent throws, so copy edits that drop the word fail the build
 * instead of silently losing the styling.
 */
export interface AccentParts {
  before: string;
  word: string;
  after: string;
}

export function accentParts(text: string, accent?: string): AccentParts | null {
  if (!accent) return null;
  const at = text.indexOf(accent);
  if (at < 0) throw new Error(`Accent "${accent}" not found in "${text}"`);
  return { before: text.slice(0, at), word: accent, after: text.slice(at + accent.length) };
}
