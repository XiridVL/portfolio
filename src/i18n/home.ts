/**
 * Home-page copy for both locales (spec §3 EN, §4 IT). Copy is final.
 * Prices are never typed here: they come from src/data/services.ts and are
 * formatted per locale, and the VAT wording follows `site.vatApplies`.
 *
 *   const copy = homeCopy[locale];
 */
import { site } from '../data/site';
import { getService, lowestPackagePrice, rates } from '../data/services';
import { formatPrice } from '../lib/format';
import type { Locale } from './locales';

export interface SectionCopy {
  /** Section number shown on the horizon rule ("01"). */
  number: string;
  /** Mono section label ("WORK"). */
  label: string;
  title: string;
  /** Word or phrase of `title` set in italic serif (must occur in the title). */
  accent?: string;
  intro?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface HomeCopy {
  hero: {
    eyebrow: string;
    /** H1, split where the line breaks on ≥640px. */
    titleLines: [string, string];
    /** Word of the title set in italic serif (must occur in one of the lines). */
    titleAccent: string;
    sub: string;
    primary: string;
    secondary: string;
    tertiary: string;
    microline: string;
    caption: string;
  };
  proof: {
    title: string;
    items: { figure: string; caption: string }[];
    footnote: string;
    tech: string[];
  };
  work: SectionCopy;
  services: SectionCopy & {
    custom: { title: string; accent: string; text: string; button: string; orEmail: string };
    rates: { lead: string; text: string };
  };
  process: SectionCopy & {
    steps: { title: string; text: string }[];
    note: string;
  };
  about: SectionCopy & {
    paragraphs: string[];
    facts: { label: string; value: string }[];
    linksLabel: string;
    toolsTitle: string;
    tools: { area: string; items: string }[];
  };
  faq: SectionCopy & { items: FaqItem[] };
  contact: SectionCopy & {
    form: {
      legend: string;
      requiredHint: string;
      budgetLabel: string;
      budgetOptions: string[];
      startLabel: string;
      startOptions: string[];
      nameLabel: string;
      messageLabel: string;
      messagePlaceholder: string;
      helper: string;
      submit: string;
      errors: { service: string; message: string };
      longBrief: string;
      /** Status after the email opens; `{email}` is replaced with a mailto link. */
      opened: string;
    };
    email: {
      subject: string;
      greeting: string;
      service: string;
      budget: string;
      start: string;
      name: string;
      notSpecified: string;
    };
    note: string;
  };
}

const price = (amount: number, locale: Locale) => formatPrice(amount, locale);
const vat = site.vatApplies;
const sprint = getService('e').priceFrom;
const care = getService('f').priceFrom;

const tech = ['Astro', 'Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'Tauri / Rust', 'Cloudflare'];

const tools = {
  frontEnd: 'TypeScript · React · Next.js · Astro · HTML/CSS · design-system tokens',
  backEnd: 'Node.js · Express · REST · Server-Sent Events · NDJSON streaming',
  data: 'PostgreSQL · Drizzle · SQL migrations · Redis',
  auth: 'OAuth 2.0 + PKCE · Stripe · App Store server verification',
  desktop: 'Tauri 2 · Rust · NSIS · signed updates',
  operations: 'Cloudflare · VPS deploys with rollback · monitoring and alerting',
  testing: 'Vitest · Node test suites · Rust unit tests',
};

const toolsIt: typeof tools = {
  frontEnd: 'TypeScript · React · Next.js · Astro · HTML/CSS · token del design system',
  backEnd: 'Node.js · Express · REST · Server-Sent Events · streaming NDJSON',
  data: 'PostgreSQL · Drizzle · migrazioni SQL · Redis',
  auth: 'OAuth 2.0 + PKCE · Stripe · verifica abbonamenti App Store',
  desktop: 'Tauri 2 · Rust · NSIS · aggiornamenti firmati',
  operations: 'Cloudflare · deploy su VPS con rollback · monitoraggio e avvisi',
  testing: 'Vitest · test Node · test unitari Rust',
};

const en: HomeCopy = {
  hero: {
    eyebrow: `${site.coordinates.short} · RIMINI, ITALY · FREELANCE WEB DEVELOPER`,
    titleLines: ['Websites and web apps,', 'measured then built.'],
    titleAccent: 'measured',
    sub: "I'm Andrea Capelli, a full-stack web developer in Rimini. I design and build fast websites, web apps, online payments and Windows desktop apps for small businesses and startups. You get a written fixed price before work starts, one direct contact, and code that's tested, monitored and easy to hand over.",
    primary: 'Get a free quote',
    secondary: 'See prices',
    tertiary: 'See the work',
    microline: [
      `Packages from ${price(lowestPackagePrice, 'en')}${vat ? ' + VAT where due' : ''}`,
      `${price(rates.daily, 'en')}/day`,
      `Reply within ${rates.replyWithin} business days`,
    ].join(' · '),
    caption: 'Streaming results, one row per player as each lookup finishes, from vStats Desktop (beta)',
  },
  proof: {
    title: 'Proof in numbers.',
    items: [
      { figure: '~200', caption: 'API routes in the vStats backend' },
      { figure: '53', caption: 'automated test files on the vStats server' },
      { figure: '5', caption: 'languages served with hreflang' },
      { figure: '3', caption: 'client platforms on one API: web, mobile, desktop' },
      { figure: '2', caption: 'Windows apps with signed auto-updates (beta)' },
    ],
    footnote: 'Counted in the vStats codebase, October 2026.',
    tech,
  },
  work: {
    number: '01',
    label: 'WORK',
    title: 'Real products, live or in beta',
    accent: 'live',
    intro:
      "These are products I designed and built: a live platform with subscription billing, two Windows apps in beta, and a league platform for a client. They're gaming products, but the work underneath is what most businesses need: pages that load fast and are found on Google in several languages, sign-in, online payments, and a site built faithfully from someone else's design.",
  },
  services: {
    number: '02',
    label: 'SERVICES',
    title: 'Clear prices, before we start',
    accent: 'before',
    intro:
      "Every project gets a written fixed price before any work begins. The prices below are where packages start; your quote depends on your exact scope, and I'll explain every line of it. If your project doesn't fit a box, ask for a custom quote.",
    custom: {
      title: "Doesn't fit a box? Get a custom quote.",
      accent: 'custom',
      text: "Tell me what you need in a few lines. We'll have a free 30-minute call, and within 3 business days you'll get a written fixed-price quote with scope, milestones, timeline and what's not included. No obligation.",
      button: 'Get a custom quote',
      orEmail: 'or email',
    },
    rates: {
      lead: `${price(rates.hourly, 'en')}/hour · ${price(rates.daily, 'en')}/day.`,
      text: `Hourly rates are for work under two days. Packages are fixed price, with a ${rates.depositPercent}% deposit and the rest by milestone.${vat ? ' All prices + VAT where due.' : ''}`,
    },
  },
  process: {
    number: '03',
    label: 'PROCESS',
    title: "How we'll work together",
    accent: 'together',
    steps: [
      { title: 'Call.', text: '30 minutes, free. You tell me the goal, the deadline and the budget; I ask about the constraints.' },
      { title: 'Written quote.', text: 'A fixed price, scope, milestones and exclusions, within 3 business days.' },
      {
        title: 'Build in milestones.',
        text: `A ${rates.depositPercent}% deposit, then a private preview link updated every week, with short written updates. Nothing is a surprise at the end.`,
      },
      { title: 'Handover.', text: 'Deployed, documented, and monitored if you want it. Care plans are optional.' },
    ],
    note: 'You own the code and the domain. Always.',
  },
  about: {
    number: '04',
    label: 'ABOUT',
    title: "Hi, I'm Andrea",
    accent: 'Andrea',
    paragraphs: [
      "I'm a full-stack web developer based in Rimini, on the Adriatic coast. I work across the whole stack: the pages your customers see, the server and database behind them, the payments and sign-in, and the monitoring that tells me something broke before you notice.",
      'Most of my recent work is my own product, vStats. I designed and built its platform and two Windows apps on a single Node backend. Before choosing its architecture I measured what the official data source could actually return, and that habit stuck: measure first, then build. Running it taught me the unglamorous half of the job: rate limits, webhooks that arrive twice, caches that have to stay bounded, updates that have to be signed, and a status page that still works when the main server is down. I also built a community site and league platform for an Italian gaming community, from their approved design.',
      'I like clear scopes, honest estimates, and plain code the next developer can read. I write tests for the paths that handle money and identity. I work in English and Italian, with clients in Romagna, the rest of Italy and the EU.',
    ],
    facts: [
      { label: 'Based in', value: 'Rimini, Italy (CET)' },
      { label: 'Works', value: 'Remotely across the EU; in person in Emilia-Romagna' },
      { label: 'Languages', value: 'Italian, English' },
      { label: 'Reply time', value: 'Within 2 business days' },
    ],
    linksLabel: 'Links',
    toolsTitle: 'What I work with',
    tools: [
      { area: 'Front end', items: tools.frontEnd },
      { area: 'Back end', items: tools.backEnd },
      { area: 'Data', items: tools.data },
      { area: 'Auth & payments', items: tools.auth },
      { area: 'Desktop', items: tools.desktop },
      { area: 'Operations', items: tools.operations },
      { area: 'Testing', items: tools.testing },
    ],
  },
  faq: {
    number: '05',
    label: 'FAQ',
    title: 'Questions clients ask',
    accent: 'ask',
    items: [
      {
        question: 'Do you work with clients outside Rimini?',
        answer:
          "Yes. Most projects run remotely by video call, anywhere in the EU. If you're in Emilia-Romagna, we can also meet in person.",
      },
      {
        question: 'Are the prices final?',
        answer:
          "They're starting points. After our call you get a written fixed price for your exact scope, and it only changes if the scope does, with your written agreement.",
      },
      {
        question: 'Who owns the code?',
        answer: 'You do: the code, the domain, the hosting and every account. I hand over all access at the end.',
      },
      {
        question: 'Can you take over an existing site or app?',
        answer: `Yes. A feature sprint (from ${price(sprint, 'en')}) is a good way to start, and it includes a short review of the codebase.`,
      },
      {
        question: 'How do invoicing and VAT work?',
        answer: vat
          ? 'I issue regular Italian invoices. Prices on this site exclude VAT (IVA), which is added where it applies.'
          : "I work under Italy's flat-rate scheme, so no VAT is added to my invoices.",
      },
      {
        question: 'What happens after launch?',
        answer: `You can run it yourself with the handover guide, or choose a care plan from ${price(care, 'en')}/month for updates, monitoring and small changes.`,
      },
      {
        question: 'How do payments work?',
        answer: `For packages: a ${rates.depositPercent}% deposit to start, the rest split across milestones. Smaller jobs are billed at ${price(rates.hourly, 'en')}/hour or ${price(rates.daily, 'en')}/day.`,
      },
    ],
  },
  contact: {
    number: '06',
    label: 'CONTACT',
    title: 'Tell me about your project',
    accent: 'your project',
    intro:
      'A few lines are enough. Write to me directly, or fill in the short brief below; it opens your email app with everything filled in. I reply within 2 business days to book a free 30-minute call.',
    form: {
      legend: 'What do you need?',
      requiredHint: 'Required.',
      budgetLabel: 'Budget range',
      budgetOptions: ['Not sure yet', 'Under €1,500', '€1,500–5,000', '€5,000–15,000', '€15,000+'],
      startLabel: 'Ideal start',
      startOptions: ['As soon as possible', 'In 1–3 months', 'Flexible'],
      nameLabel: 'Your name',
      messageLabel: 'A few lines about the project',
      messagePlaceholder: 'What do you need, and by when?',
      helper: 'Opens your email app with your answers filled in. Nothing is sent or stored by this site.',
      submit: 'Open email with this brief',
      errors: {
        service: "Choose what you need, or pick 'Something else'.",
        message: 'Add a few lines about your project.',
      },
      longBrief: 'Long briefs can be cut off by some email apps. If yours is, paste the rest into the email.',
      opened:
        'Your email app should now be open with the brief. If nothing happened, email me at {email} (your text is still here, so you can copy it).',
    },
    email: {
      subject: 'Project brief',
      greeting: 'Hi Andrea,',
      service: 'Service',
      budget: 'Budget',
      start: 'Ideal start',
      name: 'Name',
      notSpecified: 'Not specified',
    },
    note: 'Rimini, Italy (CET). Remote across the EU; in person in Emilia-Romagna.',
  },
};

const it: HomeCopy = {
  hero: {
    eyebrow: `${site.coordinates.short} · RIMINI, ITALIA · SVILUPPATORE WEB FREELANCE`,
    titleLines: ['Siti e web app,', 'prima misurati, poi costruiti.'],
    titleAccent: 'misurati',
    sub: 'Sono Andrea Capelli, sviluppatore web full-stack a Rimini. Progetto e realizzo siti veloci, web app, pagamenti online e app desktop per Windows per piccole imprese e startup. Ricevi un prezzo fisso scritto prima di iniziare, hai un solo referente, e il codice è testato, monitorato e facile da consegnare.',
    primary: 'Preventivo gratuito',
    secondary: 'Vedi i prezzi',
    tertiary: 'Guarda i lavori',
    microline: [
      `Pacchetti da ${price(lowestPackagePrice, 'it')}${vat ? ' + IVA se dovuta' : ''}`,
      `${price(rates.daily, 'it')}/giorno`,
      `Risposta entro ${rates.replyWithin} giorni lavorativi`,
    ].join(' · '),
    caption: 'Risultati in streaming, una riga per giocatore appena ogni ricerca è pronta, da vStats Desktop (beta)',
  },
  proof: {
    title: 'I numeri, misurati.',
    items: [
      { figure: '~200', caption: 'rotte API nel backend di vStats' },
      { figure: '53', caption: 'file di test automatici sul server di vStats' },
      { figure: '5', caption: 'lingue servite con hreflang' },
      { figure: '3', caption: "piattaforme client su un'unica API: web, mobile, desktop" },
      { figure: '2', caption: 'app Windows con aggiornamenti automatici firmati (beta)' },
    ],
    footnote: 'Conteggi dal codice di vStats, ottobre 2026.',
    tech,
  },
  work: {
    number: '01',
    label: 'LAVORI',
    title: 'Prodotti reali, online o in beta',
    accent: 'online',
    intro:
      'Sono prodotti che ho progettato e realizzato: una piattaforma online con abbonamenti, due app Windows in beta e una piattaforma per una lega, sviluppata per un cliente. Sono prodotti per il gaming, ma il lavoro sotto è quello che serve alla maggior parte delle aziende: pagine veloci e trovabili su Google in più lingue, login, pagamenti online e un sito realizzato fedelmente dal design di qualcun altro.',
  },
  services: {
    number: '02',
    label: 'SERVIZI',
    title: 'Prezzi chiari, prima di iniziare',
    accent: 'prima',
    intro:
      'Ogni progetto riceve un prezzo fisso scritto prima di iniziare. I prezzi qui sotto sono il punto di partenza dei pacchetti: il preventivo dipende dal tuo progetto, e ti spiego ogni voce. Se il tuo progetto non rientra in un pacchetto, chiedi un preventivo su misura.',
    custom: {
      title: 'Non rientra in un pacchetto? Chiedi un preventivo su misura.',
      accent: 'su misura',
      text: 'Raccontami in poche righe cosa ti serve. Facciamo una call gratuita di 30 minuti e, entro 3 giorni lavorativi, ricevi un preventivo scritto a prezzo fisso con perimetro, milestone, tempi e cosa non è incluso. Senza impegno.',
      button: 'Richiedi un preventivo su misura',
      orEmail: 'oppure scrivi a',
    },
    rates: {
      lead: `${price(rates.hourly, 'it')}/ora · ${price(rates.daily, 'it')}/giorno.`,
      text: `La tariffa oraria vale per lavori sotto i due giorni. I pacchetti sono a prezzo fisso, con il ${rates.depositPercent}% di acconto e il resto a milestone.${vat ? ' Tutti i prezzi + IVA se dovuta.' : ''}`,
    },
  },
  process: {
    number: '03',
    label: 'METODO',
    title: 'Come lavoreremo insieme',
    accent: 'insieme',
    steps: [
      { title: 'Call.', text: '30 minuti, gratis. Mi racconti obiettivo, scadenza e budget; io ti chiedo dei vincoli.' },
      { title: 'Preventivo scritto.', text: 'Prezzo fisso, perimetro, milestone ed esclusioni, entro 3 giorni lavorativi.' },
      {
        title: 'Sviluppo a milestone.',
        text: `Il ${rates.depositPercent}% di acconto, poi un link di anteprima privato aggiornato ogni settimana, con brevi aggiornamenti scritti. Nessuna sorpresa alla fine.`,
      },
      { title: 'Consegna.', text: 'Online, documentato e, se vuoi, monitorato. I piani di manutenzione sono facoltativi.' },
    ],
    note: 'Il codice e il dominio sono tuoi. Sempre.',
  },
  about: {
    number: '04',
    label: 'CHI SONO',
    title: 'Ciao, sono Andrea',
    accent: 'Andrea',
    paragraphs: [
      'Sono uno sviluppatore web full-stack con base a Rimini, sulla costa adriatica. Lavoro su tutto lo stack: le pagine che vedono i tuoi clienti, il server e il database dietro, i pagamenti e il login, e il monitoraggio che mi avvisa se qualcosa si rompe prima che te ne accorga tu.',
      "Gran parte del mio lavoro recente è un prodotto mio, vStats. Ho progettato e realizzato la piattaforma e due app per Windows su un unico backend Node. Prima di scegliere l'architettura ho misurato cosa poteva restituire davvero la fonte dati ufficiale, e l'abitudine è rimasta: prima misuro, poi costruisco. Gestirlo mi ha insegnato la metà meno glamour del mestiere: limiti di richieste, webhook che arrivano due volte, cache che devono restare limitate, aggiornamenti che devono essere firmati, e una pagina di stato che funziona anche quando il server principale è giù. Ho anche realizzato il sito e la piattaforma per la lega di una community italiana di gaming, a partire dal loro design approvato.",
      "Mi piacciono i perimetri chiari, le stime oneste e il codice semplice, che il prossimo sviluppatore riesce a leggere. Scrivo test per le parti che gestiscono soldi e identità. Lavoro in italiano e in inglese, con clienti in Romagna, nel resto d'Italia e nell'UE.",
    ],
    facts: [
      { label: 'Base', value: 'Rimini, Italia (CET)' },
      { label: 'Lavoro', value: "Da remoto in tutta l'UE; di persona in Emilia-Romagna" },
      { label: 'Lingue', value: 'Italiano, inglese' },
      { label: 'Tempi di risposta', value: 'Entro 2 giorni lavorativi' },
    ],
    linksLabel: 'Link',
    toolsTitle: 'Strumenti',
    tools: [
      { area: 'Front end', items: toolsIt.frontEnd },
      { area: 'Back end', items: toolsIt.backEnd },
      { area: 'Dati', items: toolsIt.data },
      { area: 'Login e pagamenti', items: toolsIt.auth },
      { area: 'Desktop', items: toolsIt.desktop },
      { area: 'Operazioni', items: toolsIt.operations },
      { area: 'Test', items: toolsIt.testing },
    ],
  },
  faq: {
    number: '05',
    label: 'FAQ',
    title: 'Domande frequenti',
    accent: 'frequenti',
    items: [
      {
        question: 'Lavori con clienti fuori Rimini?',
        answer:
          "Sì. La maggior parte dei progetti si svolge da remoto in videochiamata, ovunque nell'UE. Se sei in Emilia-Romagna possiamo anche incontrarci di persona.",
      },
      {
        question: 'I prezzi sono definitivi?',
        answer:
          'Sono punti di partenza. Dopo la call ricevi un prezzo fisso scritto per il tuo progetto, che cambia solo se cambia il perimetro, con il tuo accordo scritto.',
      },
      {
        question: 'Di chi è il codice?',
        answer: 'Tuo: codice, dominio, hosting e tutti gli account. A fine progetto ti consegno tutti gli accessi.',
      },
      {
        question: "Puoi prendere in carico un sito o un'app esistente?",
        answer: `Sì. Uno sprint di sviluppo (da ${price(sprint, 'it')}) è un buon inizio e include una breve analisi del codice.`,
      },
      {
        question: 'Come funzionano fattura e IVA?',
        answer: vat
          ? "Emetto regolare fattura italiana. I prezzi sul sito sono al netto dell'IVA, che viene aggiunta dove dovuta."
          : 'Lavoro in regime forfettario, quindi le mie fatture non includono IVA.',
      },
      {
        question: 'Cosa succede dopo il lancio?',
        answer: `Puoi gestirlo da solo con la guida di consegna, oppure scegliere un piano di manutenzione da ${price(care, 'it')}/mese per aggiornamenti, monitoraggio e piccole modifiche.`,
      },
      {
        question: 'Come funzionano i pagamenti?',
        answer: `Per i pacchetti: ${rates.depositPercent}% di acconto per iniziare, il resto diviso tra le milestone. I lavori brevi si fatturano a ${price(rates.hourly, 'it')}/ora o ${price(rates.daily, 'it')}/giorno.`,
      },
    ],
  },
  contact: {
    number: '06',
    label: 'CONTATTI',
    title: 'Parlami del tuo progetto',
    accent: 'tuo progetto',
    intro:
      'Bastano poche righe. Scrivimi direttamente oppure compila il breve modulo qui sotto: apre il tuo programma di posta con tutto già compilato. Rispondo entro 2 giorni lavorativi per fissare una call gratuita di 30 minuti.',
    form: {
      legend: 'Di cosa hai bisogno?',
      requiredHint: 'Obbligatorio.',
      budgetLabel: 'Budget indicativo',
      budgetOptions: ['Non so ancora', 'Meno di €1.500', '€1.500–5.000', '€5.000–15.000', 'Oltre €15.000'],
      startLabel: 'Quando vorresti iniziare',
      startOptions: ['Il prima possibile', 'Tra 1 e 3 mesi', 'Flessibile'],
      nameLabel: 'Il tuo nome',
      messageLabel: 'Due righe sul progetto',
      messagePlaceholder: 'Cosa ti serve, e per quando?',
      helper: 'Apre il tuo programma di posta con le risposte già compilate. Questo sito non invia né salva nulla.',
      submit: "Apri l'email con il brief",
      errors: {
        service: "Scegli di cosa hai bisogno, oppure 'Altro'.",
        message: 'Aggiungi qualche riga sul progetto.',
      },
      longBrief:
        "I testi lunghi possono essere tagliati da alcuni programmi di posta. In quel caso, incolla il resto nell'email.",
      opened:
        'Il tuo programma di posta dovrebbe essersi aperto con il brief. Se non è successo nulla, scrivimi a {email} (il testo è ancora qui, puoi copiarlo).',
    },
    email: {
      subject: 'Richiesta progetto',
      greeting: 'Ciao Andrea,',
      service: 'Servizio',
      budget: 'Budget',
      start: 'Inizio',
      name: 'Nome',
      notSpecified: 'Non indicato',
    },
    note: "Rimini, Italia (CET). Da remoto in tutta l'UE; di persona in Emilia-Romagna.",
  },
};

export const homeCopy: Record<Locale, HomeCopy> = { en, it };
