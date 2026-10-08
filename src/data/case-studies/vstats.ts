import type { CaseStudyContent } from './types';

const links = [
  { label: 'vstats.xyz', href: 'https://www.vstats.xyz' },
  { label: 'ARBITER explainer', href: 'https://www.vstats.xyz/arbiter' },
  { label: 'Rank distribution', href: 'https://www.vstats.xyz/rank-distribution' },
  { label: 'Status page', href: 'https://status.vstats.xyz' },
];

const linksIt = [
  { label: 'vstats.xyz', href: 'https://www.vstats.xyz' },
  { label: 'Come funziona ARBITER', href: 'https://www.vstats.xyz/arbiter' },
  { label: 'Distribuzione dei rank', href: 'https://www.vstats.xyz/rank-distribution' },
  { label: 'Pagina di stato', href: 'https://status.vstats.xyz' },
];

export const vstats: CaseStudyContent = {
  slug: 'vstats',
  built:
    'I designed and built a modular Node/Express backend of about 25,600 lines. It serves the website, a mobile app, two desktop apps and a partner sign-in integration from one API. Player data comes from two sources: the official Riot Games API, with a production key and Riot Sign-On so players can prove they own an account, and a third-party data service for deeper history, which runs under its own request budget. Redis holds sessions, caches and SEO summaries, and team data lives in PostgreSQL with plain-SQL migrations. Stripe Checkout and the Billing Portal handle subscriptions, with webhooks deciding who has access. Profile and stats pages are rendered on the server in five languages. A separate status page, hosted on Cloudflare, watches the whole system.',
  highlights: [
    {
      label: 'PAYMENTS',
      title: 'Subscriptions where the webhook decides access.',
      text: 'Premium and Teams plans run through Stripe Checkout and the Billing Portal, so card details never touch my server. Webhooks handle access, refunds and cancellations, and deleting an account cancels its subscriptions. The server can also verify Apple App Store subscriptions, as a second payment path.',
    },
    {
      label: 'OAUTH',
      title: 'Sign-in in both directions.',
      text: "vStats is a client of Riot Sign-On, and it is also an OAuth 2.0 provider for partner sites: <em>vStats Connect</em> lets a site without its own Riot API key link players' verified accounts. It is built on Node's built-in crypto, with no extra dependencies.",
    },
    {
      label: 'SCORING',
      title: 'ARBITER, a statistical fair-play indicator.',
      text: 'A Bayesian model combines several categories of statistical evidence into one score. It gives context; it is not cheat detection. I moved it from three client-side copies into one server-side service, so web, mobile and desktop all show the same number.',
    },
    {
      label: 'SEO & I18N',
      title: 'Search engines never wait on an upstream API.',
      text: 'Profile pages render from summaries cached in Redis, so a crawl never triggers an upstream call. Sitemaps, IndexNow submission, crawl-budget metering for bots, and stats pages in English, Brazilian Portuguese, Spanish, Turkish and Japanese with hreflang.',
    },
    {
      label: 'RESILIENCE',
      title: 'Built to stay up.',
      text: "Size-bounded caches resist floods of unique keys, a budget keeps calls within the data service's limits, and process-level error handlers catch the unexpected. Alerts (Discord, with email fallback) fire on memory pressure, unclean restarts and bursts of server errors. The public status page, with 90-day history, is hosted separately from the main server.",
    },
    {
      label: 'CRAFT',
      title: 'A design system and hand-written PNGs.',
      text: 'CSS tokens plus 28 React/TypeScript components, each with its own documentation page. Heatmaps are rendered on the server as PNG files with no image library: the file chunks and compression are written by hand.',
    },
  ],
  stack: [
    'Node.js',
    'Express',
    'PostgreSQL',
    'Redis',
    'Stripe',
    'App Store Server API',
    'Riot Games API',
    'Riot Sign-On',
    'Cloudflare Workers & Turnstile',
    'HTML/CSS/JavaScript',
    'React + TypeScript (design system)',
    'Expo / React Native',
    'Tauri',
  ],
  numbers: [
    { figure: '~25,600', caption: 'lines of server code' },
    { figure: '~200', caption: 'HTTP routes' },
    { figure: '53', caption: 'test files (~14,400 lines), run against an in-memory Postgres' },
    { figure: '5', caption: 'site languages' },
    { figure: '6', caption: 'regions in server-rendered profiles' },
    { figure: '28', caption: 'documented components' },
  ],
  en: {
    h1: 'vStats: a stats and fair-play platform for VALORANT players',
    chips: [
      { kind: 'live', text: 'LIVE' },
      { kind: 'own', text: 'OWN PRODUCT' },
    ],
    oneLiner:
      'A live platform with player profiles, a statistical fair-play indicator, pages in five languages and Stripe subscriptions. One backend serves the website, a mobile app, two desktop apps and a partner integration.',
    spec: [
      { key: 'role', value: 'Designed and built (backend, web front end, billing, infrastructure)' },
      { key: 'type', value: 'Own product' },
      { key: 'status', value: 'Live' },
      { key: 'platform', value: 'Web, plus mobile and desktop clients on the same API' },
      { key: 'links', links },
    ],
    problem:
      "Players want to look up anyone's rank, match history and form, and to judge whether a lobby looks fair. Before choosing an architecture I measured the official match history: it only reaches about 90 recent entries per player. A third-party data service goes deeper, but its rate limits are shared. Competitive teams also wanted one place for practice and strategy. And the whole platform had to run cheaply, survive outages at its data providers, and be found by search engines.",
    outcome:
      'vStats is live at vstats.xyz in five languages, with Stripe subscriptions and a public status page at status.vstats.xyz. The same backend supports a mobile app, two desktop apps and a partner integration without a second API.',
    related: { lead: 'Need subscriptions, sign-in or SEO done properly?', services: ['c', 'b'] },
  },
  it: {
    h1: 'vStats: piattaforma di statistiche e fair-play per giocatori di VALORANT',
    chips: [
      { kind: 'live', text: 'ONLINE' },
      { kind: 'own', text: 'PRODOTTO PROPRIO' },
    ],
    oneLiner:
      "Una piattaforma online con profili giocatore, un indicatore statistico di fair-play, pagine in cinque lingue e abbonamenti Stripe. Un unico backend serve il sito, un'app mobile, due app desktop e un'integrazione con siti partner.",
    spec: [
      { key: 'role', value: 'progettata e realizzata (backend, front end web, pagamenti, infrastruttura)' },
      { key: 'type', value: 'prodotto proprio' },
      { key: 'status', value: 'online' },
      { key: 'platform', value: 'web, più client mobile e desktop sulla stessa API' },
      { key: 'links', links: linksIt },
    ],
    problem:
      "I giocatori vogliono consultare rank, storico partite e forma di chiunque, e capire se una lobby è equilibrata. Prima di scegliere l'architettura ho misurato lo storico ufficiale: arriva solo a circa 90 partite recenti per giocatore. Un servizio dati di terze parti va più indietro, ma con limiti di richieste condivisi. In più la piattaforma doveva costare poco, reggere i disservizi dei fornitori ed essere trovata dai motori di ricerca.",
    outcome:
      "vStats è online su vstats.xyz in cinque lingue, con abbonamenti Stripe e una pagina di stato pubblica su status.vstats.xyz. Lo stesso backend serve un'app mobile, due app desktop e un'integrazione partner senza una seconda API.",
    related: { lead: 'Ti servono abbonamenti, login o SEO fatti bene?', services: ['c', 'b'] },
  },
};
