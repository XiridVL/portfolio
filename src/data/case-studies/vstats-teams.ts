import type { CaseStudyContent } from './types';

export const vstatsTeams: CaseStudyContent = {
  slug: 'vstats-teams',
  built:
    'I designed and built a Tauri 2 desktop app (Rust core, React 19 + TypeScript interface) and its Node/Express + PostgreSQL backend. While the team plays, the app watches the local game client, read-only. When it sees a full five-a-side custom game, it keeps just the match ID. Afterwards it fetches and uploads the match data, retrying from disk until it gets through. It captures match data, not video. The server computes per-round stats and grades every kill, death, plant and defuse. The app adds a strategy board, a VOD review lab and role-based permissions.',
  highlights: [
    {
      label: 'CAPTURE',
      title: 'Automatic practice-match capture.',
      text: 'Only qualifying custom games are kept. Unsent uploads wait on disk and retry with back-off, so a lost connection never loses a match.',
    },
    {
      label: 'SCORING',
      title: 'Decision grading.',
      text: 'Rules for trades, opening duels, clutches, saves and throws give every event one of 8 tiers, from <em>brilliant</em> to <em>blunder</em>, in the style of chess-engine move ratings. Each player gets a 0–100 decision score, and stored analyses recompute automatically when the rules change.',
    },
    {
      label: 'VOD SYNC',
      title: 'Video lined up by reading the timer.',
      text: "The Rust side captures the video player's area of the screen and reads the on-screen round timer with a custom digit reader, then lines the YouTube stream up with the match rounds, including streams that cover several maps.",
    },
    {
      label: 'EDITOR',
      title: 'A strategy drawing board.',
      text: '12 tools (arrows, zones, vision cones, barriers and more), up to 7 phases per strategy, and server-side validation of every board.',
    },
    {
      label: 'ACCESS',
      title: 'Roles and team data.',
      text: '6 roles (manager, coach, analyst, IGL, player, sub) with a permission table. Private matches are visible only to staff, and uploads are de-duplicated per team.',
    },
    {
      label: 'BILLING',
      title: 'Trials and subscriptions.',
      text: "Free-trial applications reviewed by hand, and a Stripe subscription path whose webhook sets the team's access with a grace period. Subscriptions are opening soon.",
    },
  ],
  stack: [
    'Tauri 2',
    'Rust',
    'tokio',
    'rustls',
    'keyring',
    'Windows screen capture',
    'React 19',
    'TypeScript',
    'Vite',
    'Vitest + Testing Library',
    'Node.js/Express',
    'PostgreSQL',
    'Redis',
    'Stripe',
    'YouTube Data API',
    'spreadsheet import',
  ],
  numbers: [
    { figure: '~28,900', caption: 'lines in the desktop app' },
    { figure: '71', caption: 'interface-to-core commands' },
    { figure: '53', caption: 'team API routes' },
    { figure: '6', caption: 'Postgres migrations' },
    { figure: '35 + 43', caption: 'Rust tests + interface tests' },
    { figure: '10', caption: 'server test files' },
  ],
  en: {
    h1: 'vStats Teams: practice data, decision grading and a strategy board for competitive teams',
    chips: [
      { kind: 'beta', text: 'BETA 1.0.0-beta.43' },
      { kind: 'platform', text: 'WINDOWS + SERVER' },
    ],
    oneLiner:
      "A Windows app and backend that capture a team's practice-match data, grade every kill and death, and keep the team's playbook in one place.",
    spec: [
      { key: 'role', value: 'Designed and built (desktop app and backend)' },
      { key: 'type', value: 'Own product, Windows app + server' },
      { key: 'status', value: 'Beta, 1.0.0-beta.43; subscriptions are opening soon' },
      { key: 'platform', value: 'Windows' },
      {
        key: 'links',
        links: [
          { label: 'vstats.xyz/teams', href: 'https://www.vstats.xyz/teams' },
          { label: 'Download the beta', href: 'https://www.vstats.xyz/download/teams' },
        ],
      },
    ],
    problem:
      "Competitive teams practise in private custom games that don't appear in public match history. Coaches copy stats by hand, scrub through long stream recordings to find rounds, and keep strategies in scattered drawings and spreadsheets. They needed one tool that captures every practice match automatically, explains the value of each decision, lines the video up with the match data, and keeps each map's preparation in one place, with the right permissions for every role.",
    outcome:
      'In public beta (1.0.0-beta.43) and available to download for Windows at vstats.xyz/download/teams, with signed in-app updates that install when the user chooses. Paid subscriptions are opening soon.',
    related: { lead: 'Need a SaaS with roles, billing and a real editor?', services: ['b', 'd'] },
  },
  it: {
    h1: 'vStats Teams: dati di allenamento, valutazione delle decisioni e lavagna strategie per team competitivi',
    chips: [
      { kind: 'beta', text: 'BETA 1.0.0-beta.43' },
      { kind: 'platform', text: 'WINDOWS + SERVER' },
    ],
    oneLiner:
      "Un'app Windows con backend che acquisisce i dati delle partite di allenamento, valuta ogni kill e ogni morte e raccoglie le strategie del team in un unico posto.",
    spec: [
      { key: 'role', value: 'progettata e realizzata (app desktop e backend)' },
      { key: 'type', value: 'prodotto proprio, app Windows + server' },
      { key: 'status', value: 'beta, 1.0.0-beta.43; abbonamenti in arrivo' },
      { key: 'platform', value: 'Windows' },
      {
        key: 'links',
        links: [
          { label: 'vstats.xyz/teams', href: 'https://www.vstats.xyz/teams' },
          { label: 'Scarica la beta', href: 'https://www.vstats.xyz/download/teams' },
        ],
      },
    ],
    problem:
      'I team competitivi si allenano in partite personalizzate private che non compaiono nello storico pubblico. I coach copiano le statistiche a mano, scorrono lunghe registrazioni per trovare i round e tengono le strategie tra disegni e fogli di calcolo sparsi. Serviva un unico strumento che acquisisse ogni partita di allenamento in automatico, spiegasse il valore di ogni decisione, allineasse il video con i dati e tenesse la preparazione di ogni mappa in un solo posto, con i permessi giusti per ogni ruolo.',
    outcome:
      "In beta pubblica (1.0.0-beta.43) e scaricabile per Windows su vstats.xyz/download/teams, con aggiornamenti firmati che si installano dall'app quando l'utente lo sceglie. Gli abbonamenti a pagamento sono in arrivo.",
    related: { lead: 'Ti serve un SaaS con ruoli, pagamenti e un vero editor?', services: ['b', 'd'] },
  },
};
