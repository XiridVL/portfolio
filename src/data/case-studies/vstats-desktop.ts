import type { CaseStudyContent } from './types';

export const vstatsDesktop: CaseStudyContent = {
  slug: 'vstats-desktop',
  built:
    'I built a Tauri 2 app with a Rust core and a React 19 + TypeScript interface. The Rust side owns the account, the connection to the local game client and every server call, and the interface only draws what it is sent. Every 3 seconds a background loop works out whether the player is in the menus, agent select or a live game, then builds the lobby roster. Results arrive from the vStats backend as a stream, one line per player, so one slow lookup never holds up the rest. Sign-in works by email or by Riot Sign-On through a protected deep link, and the session token lives in Windows Credential Manager. The app also has a tray icon, autostart, a "Match found" notification and signed automatic updates.',
  highlights: [
    {
      label: 'ARCHITECTURE',
      title: 'A thin interface over a Rust core.',
      text: '21 commands connect the interface to the core, and changes in sign-in, lobby and update state are pushed to the interface as events.',
    },
    {
      label: 'DETECTION',
      title: 'A resilient background loop.',
      text: 'Rank lookups run in parallel. A failed lookup waits before it is retried, a failed scan backs off, and party numbering stays stable when the roster reorders.',
    },
    {
      label: 'READ-ONLY',
      title: 'Scoped trust for the local client.',
      text: "The connection to the local game client pins Riot's root certificate. Only if that fails with a certificate error does it accept the client's self-signed certificate, and only for that one local port. It never calls anything that changes game state.",
    },
    {
      label: 'STREAMING',
      title: 'Results that fill in as they arrive.',
      text: "The backend answers in NDJSON, and a line buffer in Rust hands each player's row to the interface the moment it is complete.",
    },
    {
      label: 'UPDATES',
      title: 'Signed updates, end to end.',
      text: 'The app checks shortly after launch and then every 6 hours. The server compares versions with pre-release tags handled correctly (tested: beta.10 is newer than beta.9) and accepts only releases with an HTTPS installer and a well-formed signature, which the app verifies before installing.',
    },
    {
      label: 'HARDENING',
      title: 'A locked-down shell.',
      text: 'A strict content security policy, a navigation guard, an allow-list for external links, a single-instance lock, rustls in place of native TLS, and an optimised release build packaged as a per-user NSIS installer.',
    },
  ],
  stack: [
    'Tauri 2',
    'Rust (tokio, reqwest + rustls, serde, keyring)',
    'React 19',
    'TypeScript',
    'Vite',
    'Vitest',
    'Node.js/Express endpoints',
    'NDJSON streaming',
    'NSIS',
    'signed updates',
  ],
  numbers: [
    { figure: '~4,000', caption: 'lines of Rust in 21 files' },
    { figure: '21', caption: 'interface-to-core commands' },
    { figure: '25 + 18', caption: 'Rust tests + interface tests' },
    { figure: '6 h', caption: 'update check interval' },
  ],
  en: {
    h1: 'vStats Desktop: a read-only match companion for Windows',
    chips: [
      { kind: 'beta', text: 'BETA 1.0.0-beta.6' },
      { kind: 'platform', text: 'WINDOWS ONLY' },
    ],
    oneLiner:
      'A Windows app that notices when your match starts and brings up match context for your lobby (ranks, who queued together and a fair-play score) as results arrive.',
    spec: [
      { key: 'role', value: 'Designed and built (Rust core, interface, release tooling, backend endpoints)' },
      { key: 'type', value: 'Own product, Windows app' },
      { key: 'status', value: 'Beta, 1.0.0-beta.6' },
      { key: 'platform', value: 'Windows' },
      {
        key: 'links',
        links: [
          { label: 'vstats.xyz', href: 'https://www.vstats.xyz' },
          { label: 'Status page', href: 'https://status.vstats.xyz' },
        ],
      },
    ],
    problem:
      "vStats users wanted context about their match while it was happening: each player's rank, who had queued together, and a fair-play score. That means reading the game client's local data strictly read-only. The user's account session has to stay out of reach of web code. And the app has to update itself safely, because most people never reinstall an app by hand.",
    outcome:
      'In public beta for Windows (1.0.0-beta.6), with signed updates delivered from the vStats server, and backend tests covering the release and lobby flows.',
    related: { lead: 'Need a desktop app that updates itself safely?', services: ['d'] },
  },
  it: {
    h1: 'vStats Desktop: companion per Windows in sola lettura',
    chips: [
      { kind: 'beta', text: 'BETA 1.0.0-beta.6' },
      { kind: 'platform', text: 'SOLO WINDOWS' },
    ],
    oneLiner:
      "Un'app per Windows che riconosce l'inizio della partita e mostra il contesto della tua lobby (rank, chi gioca in gruppo con chi e un punteggio di fair-play) man mano che arrivano i risultati.",
    spec: [
      { key: 'role', value: 'progettata e realizzata (core Rust, interfaccia, strumenti di rilascio, endpoint backend)' },
      { key: 'type', value: 'prodotto proprio, app Windows' },
      { key: 'status', value: 'beta, 1.0.0-beta.6' },
      { key: 'platform', value: 'Windows' },
      {
        key: 'links',
        links: [
          { label: 'vstats.xyz', href: 'https://www.vstats.xyz' },
          { label: 'Pagina di stato', href: 'https://status.vstats.xyz' },
        ],
      },
    ],
    problem:
      "Gli utenti di vStats volevano informazioni sulla partita mentre era in corso: il rank di ogni giocatore, chi era in gruppo e un punteggio di fair-play. Questo richiede di leggere i dati locali del client di gioco in sola lettura, tenere la sessione dell'utente lontana dal codice web e aggiornare l'app in modo sicuro, perché quasi nessuno reinstalla un'app a mano.",
    outcome:
      'In beta pubblica per Windows (1.0.0-beta.6), con aggiornamenti firmati distribuiti dal server di vStats e test sul backend per i flussi di rilascio e di lobby.',
    related: { lead: "Ti serve un'app desktop che si aggiorna da sola in sicurezza?", services: ['d'] },
  },
};
