/**
 * JSON-LD builders (spec §14). Pass the results to BaseLayout's `jsonLd` prop.
 */
import { site } from '../data/site';
import { services } from '../data/services';
import type { Project } from '../data/projects';
import { routes, type RouteKey } from '../i18n/routes';
import type { Locale } from '../i18n/locales';
import { absoluteUrl } from './url';

const personId = () => `${absoluteUrl('/')}#person`;

export function personLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId(),
    name: site.name,
    jobTitle: locale === 'it' ? 'Sviluppatore web full-stack' : 'Full-Stack Web Developer',
    url: absoluteUrl(routes.home[locale]),
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: site.country },
    sameAs: [site.github, site.linkedin],
    knowsLanguage: ['it', 'en'],
  };
}

/** ProfessionalService with the six package offers (prices from services.ts). */
export function professionalServiceLd(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Andrea Capelli, web developer',
    url: absoluteUrl(routes.home[locale]),
    provider: { '@id': personId() },
    areaServed: ['Rimini', 'Emilia-Romagna', 'Italy', 'European Union'],
    priceRange: '€€',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: locale === 'it' ? 'Servizi' : 'Services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        name: s.content[locale].name,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          minPrice: s.priceFrom,
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: false,
          ...(s.per === 'month' ? { unitText: 'MONTH' } : {}),
        },
      })),
    },
  };
}

export function faqLd(items: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbLd(trail: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function creativeWorkLd(opts: { headline: string; description: string; route: RouteKey; locale: Locale; about: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(routes[opts.route][opts.locale]),
    inLanguage: opts.locale,
    author: { '@type': 'Person', '@id': personId(), name: site.name, url: absoluteUrl(routes.home[opts.locale]) },
    about: opts.about,
  };
}

/** Windows apps in beta (vStats Desktop, vStats Teams). No offers. */
export function softwareApplicationLd(project: Project, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description,
    operatingSystem: 'Windows',
    applicationCategory: 'UtilitiesApplication',
    softwareVersion: project.softwareVersion,
    author: { '@type': 'Person', '@id': personId(), name: site.name },
  };
}
