export const locales = ['en', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

/** BCP 47 tags and OG locales per site locale. */
export const localeMeta: Record<Locale, { htmlLang: string; hreflang: string; og: string; intl: string; name: string; short: string }> = {
  en: { htmlLang: 'en', hreflang: 'en', og: 'en_GB', intl: 'en-GB', name: 'English', short: 'EN' },
  it: { htmlLang: 'it', hreflang: 'it', og: 'it_IT', intl: 'it-IT', name: 'Italiano', short: 'IT' },
};

