import type { ProjectSlug } from '../projects';
import type { CaseStudyContent } from './types';
import { vstats } from './vstats';
import { vstatsDesktop } from './vstats-desktop';
import { vstatsTeams } from './vstats-teams';
import { ivpiter } from './ivpiter';

export type { CaseStudyContent, CaseStudyIntro, CaseSpecRow, SpecKey } from './types';

export const caseStudies: Record<ProjectSlug, CaseStudyContent> = {
  vstats,
  'vstats-desktop': vstatsDesktop,
  'vstats-teams': vstatsTeams,
  ivpiter,
};
