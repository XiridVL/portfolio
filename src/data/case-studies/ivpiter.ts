import type { CaseStudyContent } from './types';

/* Content guard (spec §5.4): no logo, brand art, roster, player names, staff details, league data or site link. */
export const ivpiter: CaseStudyContent = {
  slug: 'ivpiter',
  built:
    "I built a Next.js / React / TypeScript site with plain CSS Modules from the community's approved desktop and mobile design boards. The public side covers the community, news, events, roster, staff, job applications, sponsors and contact. Forms are protected against spam and post to the staff's Discord channels. In the league app, players sign in with Discord, link a verified game account through vStats Connect, and queue alone or in a party of up to three. Each match room moves through check-in, a captains' duel, a snake draft, map veto and side choice, with live updates in the browser. Results are fetched automatically and feed a skill rating. Staff get an admin panel for seasons, matches and moderation.",
  highlights: [
    {
      label: 'API CONTRACT',
      title: 'Privacy-first partner sign-in.',
      text: "Both sides of the OAuth 2.0 contract with vStats Connect: authorization code flow with mandatory PKCE, single-use codes that expire in 60 seconds, no refresh tokens, and pairwise identifiers. The community site never receives a player's vStats account ID, email or raw game ID.",
    },
    {
      label: 'ENGINE',
      title: 'A tested league engine.',
      text: 'About 28 server-side modules cover the queue, parties, check-in, draft, veto, substitutes, reports, seasons and automatic result checks, with their own test files.',
    },
    {
      label: 'RATING',
      title: 'Calibrated skill ratings.',
      text: 'An OpenSkill rating tuned with a simulator and checked against historical results. It caps the change per match and uses a separate display scale, so stored ratings never need migrating.',
    },
    {
      label: 'REAL-TIME',
      title: 'Live match rooms.',
      text: 'Server-Sent Events with a snapshot on connect, batched updates, heartbeats, and a limit on open streams per user.',
    },
    {
      label: 'SECURITY',
      title: 'Careful sessions.',
      text: "Random session tokens in HttpOnly cookies, with only their hash stored; same-origin server actions; rate-limited forms; and a token-authenticated bridge to the community's Discord bot.",
    },
    {
      label: 'DELIVERY',
      title: 'From design to code to deploy.',
      text: 'Desktop boards were matched at 1440px and mobile boards at phone width, with a screenshot script for comparing pages against the designs. Deploys build the new release side by side while the old one keeps serving, with a health check, automatic rollback and the last 5 releases kept.',
    },
  ],
  stack: [
    'Next.js 16',
    'React 19',
    'TypeScript',
    'CSS Modules',
    'Drizzle ORM',
    'PostgreSQL',
    'Vitest',
    'OpenSkill',
    'three.js',
    'Server-Sent Events',
    'OAuth 2.0 + PKCE',
    'Discord OAuth & webhooks',
    'Caddy + pm2 on a VPS',
  ],
  numbers: [
    { figure: '64', caption: 'test files' },
    { figure: '~620', caption: 'test cases' },
    { figure: '33', caption: 'pages + 16 API handlers' },
    { figure: '30', caption: 'database tables' },
    { figure: '27', caption: 'migrations' },
    { figure: '44', caption: 'design boards implemented' },
  ],
  en: {
    h1: 'IVPITER: a community website and 5v5 league platform',
    chips: [
      { kind: 'client', text: 'CLIENT WORK' },
      { kind: 'wip', text: 'IN DEVELOPMENT & TESTING' },
    ],
    oneLiner:
      "A community website and real-time league platform for an Italian VALORANT community, built from the client's approved design.",
    spec: [
      { key: 'client', value: 'IVPITER, an Italian VALORANT community (named with permission)' },
      { key: 'role', value: "Built the site and league platform from the client's approved design" },
      { key: 'status', value: 'In development and testing' },
      { key: 'platform', value: 'Web' },
      { key: 'links', value: 'None' },
    ],
    problem:
      "IVPITER ran its community and its in-house 5v5 league mostly on Discord, through a bot. It needed a real website (roster, news, staff, careers, sponsors and contact), and the league itself (queue, check-in, captains' draft, map veto, results, ratings and moderation) had to move onto the site. The community has no game API key of its own, so verified identities and match results had to come from a partner service through a privacy-preserving contract.",
    outcome:
      'A complete community site and league platform, now in development and testing with the community. The site is in Italian; the league interface is in Italian and English.',
    related: { lead: 'Need a site built from your design, or a real-time web app?', services: ['a', 'b'] },
  },
  it: {
    h1: 'IVPITER: sito community e piattaforma per una lega 5v5',
    chips: [
      { kind: 'client', text: 'LAVORO PER CLIENTE' },
      { kind: 'wip', text: 'IN SVILUPPO E TEST' },
    ],
    oneLiner:
      'Un sito per una community italiana di VALORANT e una piattaforma per la lega in tempo reale, realizzati a partire dal design approvato dal cliente.',
    spec: [
      { key: 'client', value: 'IVPITER, community italiana di VALORANT (citata con permesso)' },
      { key: 'role', value: 'realizzazione del sito e della piattaforma dal design approvato dal cliente' },
      { key: 'status', value: 'in sviluppo e test' },
      { key: 'platform', value: 'web' },
      { key: 'links', value: 'nessuno' },
    ],
    problem:
      'IVPITER gestiva la community e la sua lega interna 5v5 soprattutto su Discord, tramite un bot. Serviva un vero sito (roster, news, staff, candidature, sponsor e contatti), e la lega (coda, check-in, draft dei capitani, veto delle mappe, risultati, rating e moderazione) doveva spostarsi sul sito. La community non ha una propria chiave API di gioco, quindi identità verificate e risultati dovevano arrivare da un servizio partner, con un accordo che tutela la privacy.',
    outcome:
      "Sito e piattaforma completi, ora in sviluppo e test con la community. Il sito è in italiano; l'interfaccia della lega è in italiano e in inglese.",
    related: { lead: 'Ti serve un sito dal tuo design, o una web app in tempo reale?', services: ['a', 'b'] },
  },
};
