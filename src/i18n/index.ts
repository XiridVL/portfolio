import { en, type Strings } from './en';
import { it } from './it';
import type { Locale } from './locales';

export * from './locales';
export * from './routes';
export type { Strings };

const dictionaries: Record<Locale, Strings> = { en, it };

/** UI strings for a locale: `const t = useStrings(locale); t.header.cta`. */
export function useStrings(locale: Locale): Strings {
  return dictionaries[locale];
}
