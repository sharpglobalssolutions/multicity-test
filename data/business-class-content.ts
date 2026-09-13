import { EXPERTS_BACKGROUND_IMAGE } from "@/data/content";

/** The Business Class page's default hero background — every other
 * hardcoded default for this page now lives inline in its own component
 * (see e.g. `BusinessClassHero.tsx`'s `BusinessClassHeroProps` defaults),
 * matching the DB-driven CMS pattern (`services/business-class.service.ts`).
 * This one constant is kept here only because it's shared with the
 * homepage's `EXPERTS_BACKGROUND_IMAGE`. */
export const HERO_BACKGROUND_IMAGE = EXPERTS_BACKGROUND_IMAGE;
