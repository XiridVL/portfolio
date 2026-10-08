/**
 * <title> and meta description for every route (spec §14), plus the OG image
 * subtitle. All titles ≤ 60 chars, descriptions ≤ 155.
 *
 *   const meta = pageMeta.vstats.en;
 *   <CaseStudyLayout title={meta.title} description={meta.description} … />
 */
import type { Locale } from '../i18n/locales';
import type { RouteKey } from '../i18n/routes';

export interface PageMeta {
  title: string;
  description: string;
  /** Big title on the OG image (the title without the name suffix). */
  ogTitle: string;
}

export const pageMeta: Record<RouteKey, Record<Locale, PageMeta>> = {
  home: {
    en: {
      title: 'Andrea Capelli, Web Developer in Rimini',
      description:
        'Freelance full-stack web developer in Rimini. Websites from €1,200, web apps, Stripe payments and Tauri desktop apps. Fixed prices or a custom quote.',
      ogTitle: 'Websites and web apps, measured then built.',
    },
    it: {
      title: 'Andrea Capelli, Sviluppatore Web a Rimini',
      description:
        'Sviluppatore web full-stack freelance a Rimini. Siti da €1.200, web app, pagamenti Stripe e app desktop. Prezzi fissi o preventivo su misura.',
      ogTitle: 'Siti e web app, prima misurati, poi costruiti.',
    },
  },
  vstats: {
    en: {
      title: 'vStats Case Study: Stats Platform · Andrea Capelli',
      description:
        'How I designed and built vStats: a Node/Express backend with about 200 routes, Stripe subscriptions, OAuth and server-rendered pages in five languages.',
      ogTitle: 'vStats Case Study: Stats Platform',
    },
    it: {
      title: 'vStats: piattaforma di statistiche · Andrea Capelli',
      description:
        'Caso studio: backend Node/Express con circa 200 rotte, abbonamenti Stripe, OAuth e pagine generate sul server in cinque lingue.',
      ogTitle: 'vStats: piattaforma di statistiche',
    },
  },
  'vstats-desktop': {
    en: {
      title: 'vStats Desktop (Beta): Tauri & Rust · Andrea Capelli',
      description:
        'Case study: a read-only Windows companion app in beta, built with Tauri 2, Rust and React. Streaming results, secure sign-in, signed updates.',
      ogTitle: 'vStats Desktop (Beta): Tauri & Rust',
    },
    it: {
      title: 'vStats Desktop (beta): app Windows · Andrea Capelli',
      description:
        'Caso studio: app companion per Windows in beta, in sola lettura, con Tauri 2, Rust e React. Risultati in streaming e aggiornamenti firmati.',
      ogTitle: 'vStats Desktop (beta): app Windows',
    },
  },
  'vstats-teams': {
    en: {
      title: 'vStats Teams (Beta): Desktop + SaaS · Andrea Capelli',
      description:
        'Case study: a Windows app in beta for competitive teams. Automatic practice-match capture, decision grading, VOD sync and a strategy board.',
      ogTitle: 'vStats Teams (Beta): Desktop + SaaS',
    },
    it: {
      title: 'vStats Teams (beta): app per team · Andrea Capelli',
      description:
        'Caso studio: app Windows in beta per team competitivi. Acquisizione automatica delle partite di allenamento, valutazione delle decisioni e sync VOD.',
      ogTitle: 'vStats Teams (beta): app per team',
    },
  },
  ivpiter: {
    en: {
      title: 'IVPITER: League Platform Case Study · Andrea Capelli',
      description:
        'Client work for an Italian VALORANT community: a Next.js site and real-time 5v5 league platform, in development and testing. About 620 tests.',
      ogTitle: 'IVPITER: League Platform Case Study',
    },
    it: {
      title: 'IVPITER: piattaforma per una lega · Andrea Capelli',
      description:
        'Lavoro per una community italiana di VALORANT: sito Next.js e piattaforma per una lega 5v5 in tempo reale, in sviluppo e test. Circa 620 test.',
      ogTitle: 'IVPITER: piattaforma per una lega',
    },
  },
  privacy: {
    en: {
      title: 'Privacy · Andrea Capelli',
      description: 'No cookies, no analytics, no tracking. How this site and the contact email handle your personal data.',
      ogTitle: 'Privacy',
    },
    it: {
      title: 'Privacy · Andrea Capelli',
      description:
        "Nessun cookie, nessuna analisi, nessun tracciamento. Come questo sito e l'email di contatto trattano i tuoi dati personali.",
      ogTitle: 'Privacy',
    },
  },
};

/** The 404 page (noindex). */
export const notFoundMeta = { title: 'Page not found · Andrea Capelli', description: '' };
