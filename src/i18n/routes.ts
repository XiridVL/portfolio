/**
 * Language-switch slug map (spec §1). Paths are root-relative and do NOT include
 * the base path: wrap them with `withBase()` (or use `localeHref()` below).
 */
import { withBase, stripBase } from '../lib/url';
import type { Locale } from './locales';

export const routes = {
  home: { en: '/', it: '/it/' },
  vstats: { en: '/work/vstats/', it: '/it/lavori/vstats/' },
  'vstats-desktop': { en: '/work/vstats-desktop/', it: '/it/lavori/vstats-desktop/' },
  'vstats-teams': { en: '/work/vstats-teams/', it: '/it/lavori/vstats-teams/' },
  ivpiter: { en: '/work/ivpiter/', it: '/it/lavori/ivpiter/' },
  privacy: { en: '/privacy/', it: '/it/privacy/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

/** Home-page anchor ids, identical in both locales. */
export const anchors = ['top', 'proof', 'work', 'services', 'process', 'about', 'faq', 'contact'] as const;
export type Anchor = (typeof anchors)[number];

/** Base-aware href for a route, with optional hash: localeHref('home', 'it', 'contact') -> '/it/#contact'. */
export function localeHref(key: RouteKey, locale: Locale, hash?: string): string {
  return withBase(routes[key][locale]) + (hash ? `#${hash.replace(/^#/, '')}` : '');
}

/**
 * Href to a home-page section. On the home page itself it is a bare '#id' so
 * the browser does an in-page jump; elsewhere it points to '/#id' or '/it/#id'.
 */
export function sectionHref(anchor: Anchor, locale: Locale, onHome: boolean): string {
  return onHome ? `#${anchor}` : localeHref('home', locale, anchor);
}

/** Home href with a preselected service for the brief builder: '/?service=c#contact'. */
export function serviceHref(service: string, locale: Locale): string {
  return `${withBase(routes.home[locale])}?service=${encodeURIComponent(service)}#contact`;
}

/** Find the route and locale for a pathname (base included or not). Returns undefined for 404 etc. */
export function matchRoute(pathname: string): { key: RouteKey; locale: Locale } | undefined {
  let path = stripBase(pathname);
  if (!path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) path += '/';
  for (const key of Object.keys(routes) as RouteKey[]) {
    for (const locale of ['en', 'it'] as const) {
      if (routes[key][locale] === path) return { key, locale };
    }
  }
  return undefined;
}

/** Locale from a pathname: anything under /it/ is Italian. */
export function localeFromPath(pathname: string): Locale {
  return stripBase(pathname).startsWith('/it/') || stripBase(pathname) === '/it' ? 'it' : 'en';
}

/** The counterpart of a route in the other locale(s), for hreflang and LangSwitch. */
export function alternatesFor(key: RouteKey): Record<Locale, string> {
  return { en: routes[key].en, it: routes[key].it };
}
