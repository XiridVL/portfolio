/**
 * Base-aware URL helpers. Every internal href in the site goes through
 * `withBase()` so the build works at `/` and under `/<repo>/`.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, ''); // '' or '/repo'

/** Prefix a root-relative path ('/work/vstats/', '/#contact', '/favicon.svg') with the base path. */
export function withBase(path: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(path)) return path; // absolute, mailto:, hash, query
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${clean}`;
}

/** Remove the base path from a pathname ('/repo/it/' -> '/it/'). Always returns a path starting with '/'. */
export function stripBase(pathname: string): string {
  if (BASE && pathname.startsWith(BASE)) {
    const rest = pathname.slice(BASE.length);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return pathname || '/';
}

/** Absolute URL for canonical/OG/JSON-LD: absoluteUrl('/work/vstats/') -> 'https://…/work/vstats/'. */
export function absoluteUrl(path: string, site: URL | string | undefined = import.meta.env.SITE): string {
  const origin = site ? new URL(String(site)).origin : 'https://andrea-capelli-portfolio.onrender.com';
  return new URL(withBase(path), origin).href;
}

