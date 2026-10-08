/**
 * Packages and rates: source of truth for every price on the site (spec §15).
 * Prices are numbers (EUR, excluding VAT) and are formatted per locale with
 * `formatPrice()` from src/lib/format.ts. Never hard-code a price in a page.
 */
import type { Locale } from '../i18n/locales';
import type { RouteKey } from '../i18n/routes';

export type ServiceId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';
/** Value of `?service=` and of the brief-builder radios. */
export type ServiceChoice = ServiceId | 'custom';

export interface ProvenLink {
  label: string;
  route: RouteKey;
}

export interface ServiceCopy {
  /** Card H3 and JSON-LD offer name. */
  name: string;
  /** Label used in the related-service card on case studies ("A. Business website"). */
  relatedLabel: string;
  /** Radio label in the brief builder and the email subject ("A. Business website or landing page"). */
  formLabel: string;
  duration: string;
  bullets: string[];
  proven: ProvenLink[];
}

export interface Service {
  id: ServiceId;
  letter: string;
  /** Starting price in EUR, excluding VAT. */
  priceFrom: number;
  /** Set for recurring prices (F): rendered as "/month" / "/mese". */
  per?: 'month';
  content: Record<Locale, ServiceCopy>;
}

export const services: Service[] = [
  {
    id: 'a',
    letter: 'A',
    priceFrom: 1200,
    content: {
      en: {
        name: 'Business website or landing page',
        relatedLabel: 'A. Business website',
        formLabel: 'A. Business website or landing page',
        duration: '1–3 weeks',
        bullets: [
          'Up to 5 pages, built with Astro or plain HTML/CSS: fast, responsive and accessible',
          'Technical SEO: meta and social tags, sitemap, structured data, Lighthouse checks',
          'Contact form, privacy and cookie basics, and deployment to your hosting',
          'One language included; each extra language with hreflang +€250',
          'Two rounds of revisions',
        ],
        proven: [
          { label: 'vStats pages in five languages', route: 'vstats' },
          { label: 'IVPITER, built from an approved design', route: 'ivpiter' },
        ],
      },
      it: {
        name: 'Sito aziendale o landing page',
        relatedLabel: 'A. Sito aziendale',
        formLabel: 'A. Sito aziendale o landing page',
        duration: '1–3 settimane',
        bullets: [
          'Fino a 5 pagine, realizzate con Astro o HTML/CSS: veloci, responsive e accessibili',
          'SEO tecnica: meta tag e tag social, sitemap, dati strutturati, controlli Lighthouse',
          'Modulo di contatto, informative privacy e cookie di base, pubblicazione sul tuo hosting',
          'Una lingua inclusa; ogni lingua in più con hreflang +€250',
          'Due giri di revisioni',
        ],
        proven: [
          { label: 'pagine di vStats in cinque lingue', route: 'vstats' },
          { label: 'IVPITER, realizzato da un design approvato', route: 'ivpiter' },
        ],
      },
    },
  },
  {
    id: 'b',
    letter: 'B',
    priceFrom: 7500,
    content: {
      en: {
        name: 'Web app or SaaS MVP',
        relatedLabel: 'B. Web app or SaaS MVP',
        formLabel: 'B. Web app or SaaS MVP',
        duration: '6–10 weeks',
        bullets: [
          'One core feature set, with login and user accounts',
          'PostgreSQL schema and migrations, REST API and admin panel',
          'Automated tests on the critical paths, deploy pipeline, error alerts',
          'A tight, honest scope: one thing done properly, not a smaller version of everything',
        ],
        proven: [
          { label: 'vStats backend', route: 'vstats' },
          { label: 'IVPITER league platform', route: 'ivpiter' },
        ],
      },
      it: {
        name: 'Web app o MVP SaaS',
        relatedLabel: 'B. Web app o MVP SaaS',
        formLabel: 'B. Web app o MVP SaaS',
        duration: '6–10 settimane',
        bullets: [
          'Un insieme di funzioni principale, con login e account utente',
          'Database PostgreSQL con migrazioni, API REST e pannello di amministrazione',
          'Test automatici sui percorsi critici, pipeline di deploy, avvisi in caso di errori',
          'Un perimetro stretto e onesto: una cosa fatta bene, non una versione ridotta di tutto',
        ],
        proven: [
          { label: 'backend di vStats', route: 'vstats' },
          { label: 'piattaforma della lega IVPITER', route: 'ivpiter' },
        ],
      },
    },
  },
  {
    id: 'c',
    letter: 'C',
    priceFrom: 1500,
    content: {
      en: {
        name: 'Payments and integrations',
        relatedLabel: 'C. Payments and integrations',
        formLabel: 'C. Payments and integrations',
        duration: '1–3 weeks',
        bullets: [
          'Stripe Checkout, subscriptions, customer billing portal, refunds and webhook-driven access',
          'Or: sign-in with Google, Discord and other OAuth/SSO providers',
          'Or: a third-party API connected with caching and rate-limit handling',
          'Discord notifications and bots, spreadsheet import',
          'Added to your existing site or app',
        ],
        proven: [
          { label: 'vStats subscriptions and sign-in', route: 'vstats' },
          { label: "IVPITER's Discord integration", route: 'ivpiter' },
        ],
      },
      it: {
        name: 'Pagamenti e integrazioni',
        relatedLabel: 'C. Pagamenti e integrazioni',
        formLabel: 'C. Pagamenti e integrazioni',
        duration: '1–3 settimane',
        bullets: [
          'Stripe Checkout, abbonamenti, portale clienti per la fatturazione, rimborsi e accessi gestiti via webhook',
          'Oppure: accesso con Google, Discord e altri provider OAuth/SSO',
          "Oppure: un'API di terze parti collegata con cache e gestione dei limiti di richieste",
          'Notifiche e bot Discord, importazione da fogli di calcolo',
          'Aggiunti al tuo sito o alla tua app esistente',
        ],
        proven: [
          { label: 'abbonamenti e login di vStats', route: 'vstats' },
          { label: 'integrazione Discord di IVPITER', route: 'ivpiter' },
        ],
      },
    },
  },
  {
    id: 'd',
    letter: 'D',
    priceFrom: 6000,
    content: {
      en: {
        name: 'Desktop app for Windows',
        relatedLabel: 'D. Desktop app for Windows',
        formLabel: 'D. Desktop app for Windows',
        duration: '5–8 weeks',
        bullets: [
          'A Windows app built with Tauri 2 (Rust core, React/TypeScript interface), connected to your API',
          'Secure sign-in, with the session kept in the Windows credential store',
          'Tray icon, notifications, start with Windows',
          'Installer, signed automatic updates and release tooling on your server',
        ],
        proven: [
          { label: 'vStats Desktop (beta)', route: 'vstats-desktop' },
          { label: 'vStats Teams (beta)', route: 'vstats-teams' },
        ],
      },
      it: {
        name: 'App desktop per Windows',
        relatedLabel: 'D. App desktop per Windows',
        formLabel: 'D. App desktop per Windows',
        duration: '5–8 settimane',
        bullets: [
          "Un'app Windows realizzata con Tauri 2 (core in Rust, interfaccia React/TypeScript), collegata alla tua API",
          "Login sicuro, con la sessione salvata nell'archivio credenziali di Windows",
          "Icona nell'area di notifica, notifiche, avvio con Windows",
          'Installer, aggiornamenti automatici firmati e strumenti di rilascio sul tuo server',
        ],
        proven: [
          { label: 'vStats Desktop (beta)', route: 'vstats-desktop' },
          { label: 'vStats Teams (beta)', route: 'vstats-teams' },
        ],
      },
    },
  },
  {
    id: 'e',
    letter: 'E',
    priceFrom: 680,
    content: {
      en: {
        name: 'Feature sprint, speed or SEO fix',
        relatedLabel: 'E. Feature sprint, speed or SEO fix',
        formLabel: 'E. Feature sprint, speed or SEO fix',
        duration: 'from 2 days',
        bullets: [
          'Fixed-scope work on your existing codebase',
          'A new feature, a speed and Core Web Vitals pass, adding languages, or monitoring with a status page',
          'A short review of the codebase is included when I take over an existing project',
        ],
        proven: [{ label: 'vStats monitoring, alerts and status page', route: 'vstats' }],
      },
      it: {
        name: 'Sprint di sviluppo, velocità o SEO',
        relatedLabel: 'E. Sprint di sviluppo, velocità o SEO',
        formLabel: 'E. Sprint di sviluppo, velocità o SEO',
        duration: 'da 2 giorni',
        bullets: [
          'Lavoro a perimetro fisso sul tuo codice esistente',
          'Una nuova funzione, un intervento su velocità e Core Web Vitals, nuove lingue, oppure monitoraggio con pagina di stato',
          'Se prendo in carico un progetto esistente, è inclusa una breve analisi del codice',
        ],
        proven: [{ label: 'monitoraggio, avvisi e pagina di stato di vStats', route: 'vstats' }],
      },
    },
  },
  {
    id: 'f',
    letter: 'F',
    priceFrom: 180,
    per: 'month',
    content: {
      en: {
        name: 'Care plan: maintenance and support',
        relatedLabel: 'F. Care plan',
        formLabel: 'F. Care plan',
        duration: 'minimum 3 months',
        bullets: [
          '4 hours a month included; extra hours at €45/hour',
          'Updates and security patches, uptime monitoring with alerts, backup checks, small changes',
          'Reply within 2 business days',
          'Web-app tier: 10 hours a month, €420/month',
        ],
        proven: [],
      },
      it: {
        name: 'Piano di manutenzione e assistenza',
        relatedLabel: 'F. Piano di manutenzione',
        formLabel: 'F. Piano di manutenzione',
        duration: 'minimo 3 mesi',
        bullets: [
          '4 ore al mese incluse; ore extra a €45/ora',
          'Aggiornamenti e patch di sicurezza, monitoraggio con avvisi, verifica dei backup, piccole modifiche',
          'Risposta entro 2 giorni lavorativi',
          'Livello per web app: 10 ore al mese, €420/mese',
        ],
        proven: [],
      },
    },
  },
];

/** The "Something else / custom quote" choice in the brief builder. */
export const customChoice = {
  id: 'custom' as const,
  formLabel: { en: 'Something else / custom quote', it: 'Altro / preventivo su misura' } satisfies Record<Locale, string>,
};

/** Rates and terms (spec §15). */
export const rates = {
  hourly: 45,
  daily: 340,
  depositPercent: 30,
  extraLanguage: 250,
  care: { includedHours: 4, extraHourly: 45, webAppTierMonthly: 420, webAppTierHours: 10, minimumMonths: 3 },
  /** Business days. */
  replyWithin: 2,
  quoteWithin: 3,
  /** Free intro call length, in minutes. */
  introCall: 30,
} as const;

export const serviceIds = services.map((s) => s.id);

export function getService(id: ServiceId): Service {
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown service id: ${id}`);
  return service;
}

/** Lowest package price ("Packages from €680"). */
export const lowestPackagePrice = Math.min(...services.filter((s) => !s.per).map((s) => s.priceFrom));
