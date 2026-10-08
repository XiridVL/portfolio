import type { Locale } from '../i18n/locales';

const enFormatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
// 'always' forces the thousands separator: it-IT would otherwise print 1200, not 1.200.
const itFormatter = new Intl.NumberFormat('it-IT', { useGrouping: 'always', maximumFractionDigits: 0 });

/** formatPrice(1200, 'en') -> '€1,200'; formatPrice(1200, 'it') -> '€1.200'. */
export function formatPrice(amount: number, locale: Locale): string {
  return locale === 'it' ? `€${itFormatter.format(amount)}` : enFormatter.format(amount);
}

/** Plain number formatting for figures: 25600 -> '25,600' (en) / '25.600' (it). */
export function formatNumber(n: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-GB', { useGrouping: 'always' }).format(n);
}
