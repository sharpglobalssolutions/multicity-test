import type { ExpertFeatureInput } from "@/components/ExpertsSection";
import type { Deal, RouteDeal, ServiceCard, Stat, Testimonial } from "@/data/content";

/** One `data` shape per `SECTION_TYPE` (see `validations/page-section.validation.ts`) —
 * shared contract between the admin section editor and the homepage's
 * prop-ified components. Every field mirrors that component's optional
 * props exactly, so `<Component {...data} />` always type-checks. */

export interface HeroSectionData {
  headingLines: string[];
  subheading: string;
  imageSrc: string;
  primaryButtonLabel: string;
  primaryButtonHref: string;
  secondaryButtonLabel: string;
  secondaryButtonHref: string;
}

export interface PartnerStripSectionData {
  airlines: string[];
}

export interface DealsSectionData {
  heading: string;
  subheading: string;
  deals: Deal[];
}

export interface BusinessClassSectionData {
  heading: string;
  body: string;
  images: { src: string; alt: string }[];
}

export interface PersonalizedJourneySectionData {
  heading: string;
  body: string;
  images: { src: string; alt: string }[];
}

export interface StatisticsSectionData {
  stats: Stat[];
}

export interface TravelAdvisorSectionData {
  heading: string;
  paragraphs: string[];
  imageSrc: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface ServicesSectionData {
  heading: string;
  subheading: string;
  services: ServiceCard[];
}

export interface SupportSectionData {
  heading: string;
  paragraphs: string[];
  items: string[][];
  imageSrc: string;
}

export interface ExpertsSectionData {
  heading: string;
  subtitle1: string;
  subtitle2: string;
  backgroundImage: string;
  features: ExpertFeatureInput[];
}

export interface TestimonialsSectionData {
  heading: string;
  subheading: string;
  testimonials: Testimonial[];
}

export interface FaqSectionData {
  eyebrow: string;
  heading: string;
  faqs: { id: string; question: string; answer: string }[];
}

export interface InsightsSectionData {
  heading: string;
  subheading: string;
}

export interface RoutesSectionData {
  heading: string;
  subheading: string;
  routes: RouteDeal[];
}

export interface CtaSectionData {
  heading: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
  backgroundImage: string;
}

export interface SocialSectionData {
  heading: string;
}

/** Maps each `SECTION_TYPE` string to its `data` interface — used by the
 * admin section editor's field-schema config and by the homepage renderer
 * to type each section's `data` before spreading it as props. */
export interface SectionDataByType {
  HERO: HeroSectionData;
  PARTNER_STRIP: PartnerStripSectionData;
  DEALS: DealsSectionData;
  BUSINESS_CLASS: BusinessClassSectionData;
  PERSONALIZED_JOURNEY: PersonalizedJourneySectionData;
  STATISTICS: StatisticsSectionData;
  TRAVEL_ADVISOR: TravelAdvisorSectionData;
  SERVICES: ServicesSectionData;
  SUPPORT: SupportSectionData;
  EXPERTS: ExpertsSectionData;
  TESTIMONIALS: TestimonialsSectionData;
  FAQ: FaqSectionData;
  INSIGHTS: InsightsSectionData;
  ROUTES: RoutesSectionData;
  CTA: CtaSectionData;
  SOCIAL: SocialSectionData;
}

export type SectionType = keyof SectionDataByType;
