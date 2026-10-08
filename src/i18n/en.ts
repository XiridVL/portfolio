/**
 * English UI strings for global elements (spec §2, §5 template, §16).
 * `it.ts` must match this shape exactly (enforced by the `Strings` type).
 * Page builders: add page-specific copy under a new top-level key in BOTH files.
 */
export const en = {
  skipLink: 'Skip to content',
  header: {
    logoLabel: 'Andrea Capelli, home',
    wordmark: 'Andrea Capelli',
    navLabel: 'Main',
    nav: {
      work: 'Work',
      services: 'Services',
      about: 'About',
      faq: 'FAQ',
      contact: 'Contact',
    },
    cta: 'Get a quote',
    menuOpen: 'Menu',
    menuClose: 'Close menu',
  },
  lang: {
    groupLabel: 'Language',
  },
  mobileCta: {
    quote: 'Get a free quote',
    email: 'Email Andrea',
  },
  footer: {
    role: 'Full-stack web developer · Rimini, Italy',
    coords: '44.0594° N · 12.5683° E',
    privacy: 'Privacy',
    vatLabel: 'P.IVA',
    noCookies: 'This site uses no cookies and no tracking.',
    copyright: '© 2026 Andrea Capelli. Visuals on this site are original illustrations.',
  },
  externalHint: '(opens in a new tab)',
  disclaimer: {
    site: 'VALORANT and Riot Games are trademarks of Riot Games, Inc. This site and its projects are not affiliated with or endorsed by Riot Games.',
    grid: "Mockups on this site are illustrations, not screenshots. IVPITER is named with the client's permission. VALORANT and Riot Games are trademarks of Riot Games, Inc. These projects are not affiliated with or endorsed by Riot Games.",
    project: 'VALORANT and Riot Games are trademarks of Riot Games, Inc. This project is not affiliated with or endorsed by Riot Games.',
  },
  price: {
    from: 'from',
    perMonth: '/month',
    vatSuffix: '+ VAT where due',
  },
  work: {
    readCase: 'Read the case study',
  },
  services: {
    ask: 'Ask about this',
    custom: 'or get a custom quote',
    proven: 'Proven by:',
  },
  copyEmail: {
    button: 'Copy',
    copied: 'Email address copied',
    fallback: 'Press Ctrl+C to copy',
  },
  caseStudy: {
    breadcrumbLabel: 'Breadcrumb',
    breadcrumbRoot: 'Work',
    specLabel: 'Project details',
    spec: {
      client: 'Client',
      role: 'Role',
      type: 'Type',
      status: 'Status',
      platform: 'Platform',
      links: 'Links',
    },
    problem: 'The problem',
    built: 'What I built',
    highlights: 'Highlights',
    how: 'How it works',
    stack: 'Stack',
    numbers: 'By the numbers',
    outcome: 'Outcome',
    /** Italian pages only: divider before the English body. Unused on EN pages. */
    deepDive: '',
    relatedSee: 'See',
    relatedOr: 'or',
    ctaText: 'Need something like this? Get a free quote.',
    ctaButton: 'Get a free quote',
    navLabel: 'More case studies',
    prev: 'Previous',
    next: 'Next',
  },
};

export type Strings = typeof en;
