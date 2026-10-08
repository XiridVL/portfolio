/** Site-wide facts. Single source for name, contact, links, coordinates and tax details. */
export const site = {
  name: 'Andrea Capelli',
  email: 'xirid@proton.me',
  github: 'https://github.com/XiridVL',
  linkedin: 'https://it.linkedin.com/in/andrea-capelli-0476a2299',
  city: 'Rimini',
  region: 'Emilia-Romagna',
  country: 'IT',
  /** Footer coordinates (precise) and hero eyebrow coordinates (rounded). */
  coordinates: { lat: 44.0594, lon: 12.5683, label: '44.0594° N · 12.5683° E', short: '44.06° N 12.57° E' },
  /** Domain once chosen; production URL comes from SITE_URL at build time. */
  domain: 'xiridvl.github.io',

  // TODO(launch blocker): add the P.IVA (Italian VAT number). The footer renders
  // "P.IVA <number>" only when this is a non-empty string.
  vatNumber: '' as string,
  // TODO(launch blocker): add the full business address (shown on the privacy pages).
  businessAddress: '' as string,

  /**
   * true  -> prices show "+ VAT where due" / "+ IVA se dovuta".
   * false -> regime forfettario: hide the suffix site-wide (and update FAQ 5, spec §17).
   */
  vatApplies: true,
} as const;

export type Site = typeof site;
