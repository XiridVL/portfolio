/**
 * Project card data for the home "Work" grid (spec §3.3 / §4.3) plus shared
 * project metadata (order, names, versions) used by case-study pages.
 */
import type { Locale } from '../i18n/locales';
import { localeHref } from '../i18n/routes';

export type ProjectSlug = 'vstats' | 'vstats-desktop' | 'vstats-teams' | 'ivpiter';

/** Status chip variants (see StatusChip.astro). Chips always carry words. */
export type ChipKind = 'live' | 'beta' | 'client' | 'wip' | 'own' | 'platform';
export interface ChipData {
  kind: ChipKind;
  text: string;
}
export interface SpecRow {
  label: string;
  value: string;
}
export interface ExternalLinkData {
  /** Visible text, without the ↗ (components add it). */
  label: string;
  href: string;
}

export interface ProjectCard {
  chips: ChipData[];
  /** Card H3. */
  title: string;
  oneLiner: string;
  specRows: SpecRow[];
  /** External links shown next to "Read the case study". Case-study link is implied. */
  external: ExternalLinkData[];
}

export interface Project {
  slug: ProjectSlug;
  /** Short name for breadcrumbs, prev/next and JSON-LD. */
  name: string;
  /** Beta version, when the product is a Windows app in beta. */
  softwareVersion?: string;
  card: Record<Locale, ProjectCard>;
}

export const projects: Project[] = [
  {
    slug: 'vstats',
    name: 'vStats',
    card: {
      en: {
        chips: [
          { kind: 'live', text: 'LIVE' },
          { kind: 'own', text: 'OWN PRODUCT' },
        ],
        title: 'vStats: stats and fair-play platform',
        oneLiner:
          'A live VALORANT stats platform with player profiles, a statistical fair-play indicator, pages in five languages, and Stripe subscriptions.',
        specRows: [
          { label: 'Backend', value: 'Node/Express · ~200 routes' },
          { label: 'Data', value: 'PostgreSQL · Redis' },
          { label: 'Billing', value: 'Stripe Checkout, Billing Portal, webhooks' },
        ],
        external: [{ label: 'vstats.xyz', href: 'https://www.vstats.xyz' }],
      },
      it: {
        chips: [
          { kind: 'live', text: 'ONLINE' },
          { kind: 'own', text: 'PRODOTTO PROPRIO' },
        ],
        title: 'vStats: piattaforma di statistiche e fair-play',
        oneLiner:
          'Una piattaforma di statistiche per VALORANT, online, con profili giocatore, un indicatore statistico di fair-play, pagine in cinque lingue e abbonamenti Stripe.',
        specRows: [
          { label: 'Backend', value: 'Node/Express · ~200 rotte' },
          { label: 'Dati', value: 'PostgreSQL · Redis' },
          { label: 'Pagamenti', value: 'Stripe Checkout, Billing Portal, webhook' },
        ],
        external: [{ label: 'vstats.xyz', href: 'https://www.vstats.xyz' }],
      },
    },
  },
  {
    slug: 'vstats-desktop',
    name: 'vStats Desktop',
    softwareVersion: '1.0.0-beta.6',
    card: {
      en: {
        chips: [
          { kind: 'beta', text: 'BETA 1.0.0-beta.6' },
          { kind: 'platform', text: 'WINDOWS' },
        ],
        title: 'vStats Desktop: a read-only Windows companion',
        oneLiner:
          'A Windows app that notices when your match starts and brings up match context for your lobby (ranks, who queued together and a fair-play score) as results arrive.',
        specRows: [
          { label: 'Core', value: 'Tauri 2 · Rust · React 19' },
          { label: 'Security', value: 'OS credential store · strict CSP' },
          { label: 'Delivery', value: 'NSIS installer · signed updates' },
        ],
        external: [],
      },
      it: {
        chips: [
          { kind: 'beta', text: 'BETA 1.0.0-beta.6' },
          { kind: 'platform', text: 'WINDOWS' },
        ],
        title: 'vStats Desktop: companion per Windows in sola lettura',
        oneLiner:
          "Un'app per Windows che riconosce l'inizio della partita e mostra il contesto della tua lobby (rank, chi gioca in gruppo con chi e un punteggio di fair-play) man mano che arrivano i risultati.",
        specRows: [
          { label: 'Core', value: 'Tauri 2 · Rust · React 19' },
          { label: 'Sicurezza', value: 'archivio credenziali del sistema · CSP restrittiva' },
          { label: 'Distribuzione', value: 'installer NSIS · aggiornamenti firmati' },
        ],
        external: [],
      },
    },
  },
  {
    slug: 'vstats-teams',
    name: 'vStats Teams',
    softwareVersion: '1.0.0-beta.43',
    card: {
      en: {
        chips: [
          { kind: 'beta', text: 'BETA 1.0.0-beta.43' },
          { kind: 'platform', text: 'WINDOWS + SERVER' },
        ],
        title: 'vStats Teams: a practice workspace for competitive teams',
        oneLiner:
          "A Windows app and backend that capture a team's practice-match data automatically, grade every kill and death, and keep the team's strategy playbook in one place. Subscriptions are opening soon.",
        specRows: [
          { label: 'App', value: 'Tauri 2 · Rust · React 19' },
          { label: 'Server', value: 'Express · PostgreSQL · 53 routes' },
          { label: 'Features', value: '8-tier decision grading · strategy board · VOD sync' },
        ],
        external: [{ label: 'vstats.xyz/teams', href: 'https://www.vstats.xyz/teams' }],
      },
      it: {
        chips: [
          { kind: 'beta', text: 'BETA 1.0.0-beta.43' },
          { kind: 'platform', text: 'WINDOWS + SERVER' },
        ],
        title: 'vStats Teams: uno spazio di lavoro per team competitivi',
        oneLiner:
          "Un'app Windows con backend che acquisisce automaticamente i dati delle partite di allenamento, valuta ogni kill e ogni morte e raccoglie le strategie del team in un unico posto. Abbonamenti in arrivo.",
        specRows: [
          { label: 'App', value: 'Tauri 2 · Rust · React 19' },
          { label: 'Server', value: 'Express · PostgreSQL · 53 rotte' },
          { label: 'Funzioni', value: 'valutazione delle decisioni su 8 livelli · lavagna strategie · sync VOD' },
        ],
        external: [{ label: 'vstats.xyz/teams', href: 'https://www.vstats.xyz/teams' }],
      },
    },
  },
  {
    slug: 'ivpiter',
    name: 'IVPITER',
    card: {
      en: {
        chips: [
          { kind: 'client', text: 'CLIENT WORK' },
          { kind: 'wip', text: 'IN DEVELOPMENT & TESTING' },
        ],
        title: 'IVPITER: community site and 5v5 league platform',
        oneLiner:
          "Client work for an Italian VALORANT community: a website and a real-time league platform with queue, check-in, captains' draft and map veto, built from the client's approved design.",
        specRows: [
          { label: 'Stack', value: 'Next.js · React · TypeScript · Drizzle/PostgreSQL' },
          { label: 'Real-time', value: 'Server-Sent Events' },
          { label: 'Quality', value: '64 test files · about 620 test cases' },
        ],
        external: [],
      },
      it: {
        chips: [
          { kind: 'client', text: 'LAVORO PER CLIENTE' },
          { kind: 'wip', text: 'IN SVILUPPO E TEST' },
        ],
        title: 'IVPITER: sito community e piattaforma per una lega 5v5',
        oneLiner:
          'Lavoro per una community italiana di VALORANT: un sito e una piattaforma per la lega in tempo reale, con coda, check-in, draft dei capitani e veto delle mappe, realizzati a partire dal design approvato dal cliente.',
        specRows: [
          { label: 'Stack', value: 'Next.js · React · TypeScript · Drizzle/PostgreSQL' },
          { label: 'Tempo reale', value: 'Server-Sent Events' },
          { label: 'Qualità', value: '64 file di test · circa 620 casi di test' },
        ],
        external: [],
      },
    },
  },
];

export function getProject(slug: ProjectSlug): Project {
  const project = projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Unknown project: ${slug}`);
  return project;
}

/** Card data plus the base-aware case-study href, in display order. */
export function projectCards(locale: Locale): Array<ProjectCard & { slug: ProjectSlug; name: string; href: string }> {
  return projects.map((p) => ({ ...p.card[locale], slug: p.slug, name: p.name, href: localeHref(p.slug, locale) }));
}

/** Previous/next in the order vStats → Desktop → Teams → IVPITER → vStats (wraps). */
export function adjacentProjects(slug: ProjectSlug): { prev: Project; next: Project } {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n]!, next: projects[(i + 1) % n]! };
}

/** Shared view-transition names for a card mockup/title and its case-study hero (spec §12.5). */
export function transitionNames(slug: ProjectSlug): { mock: string; title: string } {
  return { mock: `mock-${slug}`, title: `title-${slug}` };
}
