import type { ExpertFeatureInput } from "@/components/ExpertsSection";
import type { BusinessClassServiceItem } from "@/components/business-class/BusinessClassServices";
import type { ExpertiseDestinationImage, ExpertiseRoute } from "@/components/business-class/BusinessClassExpertise";
import type { FareComplexityItem } from "@/components/business-class/FareComplexity";
import type { HowItWorksStep } from "@/components/business-class/HowItWorks";
import type { JourneySlide } from "@/components/business-class/JourneyCarousel";
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

/** The single content block behind the "Policy Page" template (see
 * `components/PolicyPageTemplate.tsx`) — `subtitle` is the hero
 * category/breadcrumb (e.g. "Legal · MultiCityExperts"); `bannerImage` is
 * the hero background (falls back to a default when unset); `content` is
 * HTML from the admin's rich-text editor, the single source both the
 * table of contents and the rendered body are derived from. */
export interface PolicyContentSectionData {
  subtitle: string;
  bannerImage: string;
  content: string;
}

/** Site-wide header chrome — lives on the singleton "chrome" page (see
 * `services/chrome.service.ts`), not any real content page. Mirrors
 * `HeaderClient`'s optional props exactly. */
export interface HeaderSectionData {
  logoImageSrc: string;
  phone: string;
  navLinks: { label: string; href: string }[];
}

/** Site-wide footer chrome — same singleton page as `HeaderSectionData`.
 * `footerNavColumns` is a fixed set of 4 columns (Services/Insights/
 * Company/Legal today) — the admin editor special-cases it the same way
 * `SUPPORT.items` is special-cased, since a list-of-objects-containing-a-
 * list doesn't fit the generic field-schema model. The Top Countries/
 * Cities/Airlines columns and the Get in Touch / newsletter forms are
 * NOT part of this — they stay DB-driven/functional, not chrome content. */
export interface FooterSectionData {
  connectHeading: string;
  socialLinks: { label: string; href: string; icon: string }[];
  trustBadges: string[];
  newsletterHeading: string;
  darkHeadingLines: string[];
  logoImageSrc: string;
  tagline: string;
  footerNavColumns: { title: string; links: { label: string; href: string }[] }[];
  copyrightText: string;
  privacyPolicyHref: string;
  termsHref: string;
}

/** Business Class landing page (`business-class` template) — one
 * interface per component, in the order `app/business-class/page.tsx`
 * renders them. `titleLines`/`descriptionLines`/`factors` below are
 * newline-separated strings, not arrays — the admin field-schema list
 * editor only supports scalar item fields, so a list item's own
 * multi-line text is stored as one string and split by the consuming
 * component at render time (the same reasoning `subheading` above is
 * stored as one HTML string rather than structured data). */
export interface BcHeroSectionData {
  headingLines: string[];
  description: string;
  backgroundImage: string;
}

export interface BcQuickConsultSectionData {
  heading: string;
  subheading: string;
  deals: { id: string; city: string; airline: string; price: string; image: string; alt: string }[];
}

export interface BcStatsSectionData {
  stats: { id: string; value: number; suffix: string; label: string; displayValue?: string }[];
}

export interface BcOptionsSectionData {
  heading: string;
  subheading: string;
}

export interface BcOptionsBlockSectionData {
  eyebrowLines: string[];
  body: string;
  images: { src: string; alt: string }[];
  buttonLabel: string;
  buttonHref: string;
}

export interface BcFareComplexitySectionData {
  heading: string;
  subheading: string;
  items: FareComplexityItem[];
}

export interface BcBeyondPriceSectionData {
  eyebrow: string;
  heading: string[];
  benefits: { id: string; title: string; description: string }[];
}

export interface BcHowItWorksSectionData {
  heading: string;
  subheading: string;
  steps: HowItWorksStep[];
}

export interface BcJourneySectionData {
  slides: JourneySlide[];
}

export interface BcServicesSectionData {
  heading: string;
  services: BusinessClassServiceItem[];
}

export interface BcExpertiseSectionData {
  heading: string[];
  images: ExpertiseDestinationImage[];
  routes: ExpertiseRoute[];
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
  POLICY_CONTENT: PolicyContentSectionData;
  HEADER: HeaderSectionData;
  FOOTER: FooterSectionData;
  BC_HERO: BcHeroSectionData;
  BC_QUICK_CONSULT: BcQuickConsultSectionData;
  BC_STATS: BcStatsSectionData;
  BC_OPTIONS: BcOptionsSectionData;
  BC_OPTIONS_ONE_WAY: BcOptionsBlockSectionData;
  BC_OPTIONS_MULTI_CITY: BcOptionsBlockSectionData;
  BC_FARE_COMPLEXITY: BcFareComplexitySectionData;
  BC_BEYOND_PRICE: BcBeyondPriceSectionData;
  BC_HOW_IT_WORKS: BcHowItWorksSectionData;
  BC_JOURNEY: BcJourneySectionData;
  BC_SERVICES: BcServicesSectionData;
  BC_EXPERTISE: BcExpertiseSectionData;
}

export type SectionType = keyof SectionDataByType;
