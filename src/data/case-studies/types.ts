/**
 * Case-study content (spec §5 English, §6 Italian). The English technical body
 * (what I built, highlights, stack, numbers, outcome) is shared by both
 * locales; the Italian pages add their own intro, problem, outcome and
 * related-service lead.
 */
import type { ChipData, ProjectSlug } from '../projects';
import type { ServiceId } from '../services';

export type SpecKey = 'client' | 'role' | 'type' | 'status' | 'platform' | 'links';

export interface CaseSpecRow {
  /** Label key into useStrings(locale).caseStudy.spec. */
  key: SpecKey;
  value?: string;
  links?: { label: string; href: string }[];
}

export interface CaseStudyIntro {
  h1: string;
  chips: ChipData[];
  oneLiner: string;
  spec: CaseSpecRow[];
  problem: string;
  outcome: string;
  related: { lead: string; services: ServiceId[] };
}

export interface CaseStudyContent {
  slug: ProjectSlug;
  /** "What I built" (English, both locales). */
  built: string;
  /** Highlights 01–06; `text` may contain <em>. */
  highlights: { label: string; title: string; text: string }[];
  stack: string[];
  numbers: { figure: string; caption: string }[];
  en: CaseStudyIntro;
  it: CaseStudyIntro;
}
