/**
 * SEO helpers (spec §14): the JSON-LD bundles for each page type and safe
 * serialisation for <script type="application/ld+json">.
 *
 * The individual schema.org builders live in ./jsonld and are re-exported here,
 * so pages can import everything SEO-related from one module.
 */
import { getProject, type ProjectSlug } from '../data/projects';
import { routes } from '../i18n/routes';
import type { Locale } from '../i18n/locales';
import {
  breadcrumbLd,
  creativeWorkLd,
  faqLd,
  personLd,
  professionalServiceLd,
  softwareApplicationLd,
} from './jsonld';

export { breadcrumbLd, creativeWorkLd, faqLd, personLd, professionalServiceLd, softwareApplicationLd };

/** OG image size (spec §14). */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

/** Root-relative path of a page's OG image: /og/{locale}-{routeKey}.png. */
export const ogImagePath = (locale: Locale, routeKey: string) => `/og/${locale}-${routeKey}.png`;

/** Home pages: Person + ProfessionalService (6 offers) + FAQPage. */
export function homeJsonLd(locale: Locale, faq: Array<{ question: string; answer: string }>) {
  return [personLd(locale), professionalServiceLd(locale), faqLd(faq.map(({ question, answer }) => ({ question, answer: plainText(answer) })))];
}

/** Case studies: CreativeWork + BreadcrumbList, plus SoftwareApplication for the beta Windows apps. */
export function caseStudyJsonLd(opts: {
  slug: ProjectSlug;
  locale: Locale;
  headline: string;
  description: string;
  crumbs: { root: string; rootPath?: string };
  /** Description for the SoftwareApplication block (defaults to `description`). */
  appDescription?: string;
}) {
  const project = getProject(opts.slug);
  return [
    creativeWorkLd({ headline: opts.headline, description: opts.description, route: opts.slug, locale: opts.locale, about: project.name }),
    breadcrumbLd([
      { name: opts.crumbs.root, path: opts.crumbs.rootPath ?? routes.home[opts.locale] },
      { name: project.name, path: routes[opts.slug][opts.locale] },
    ]),
    ...(project.softwareVersion ? [softwareApplicationLd(project, opts.appDescription ?? opts.description)] : []),
  ];
}

/** Strip tags and collapse whitespace (FAQ answers may carry inline markup). */
export function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * JSON for an inline ld+json script. Escapes `<`, `>` and `&` (and the JS line
 * separators) so no string in the data can close the script element early.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/[\u2028\u2029]/g, (c) => `\\u${c.charCodeAt(0).toString(16)}`);
}
