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
  /** Optional — when set, plays instead of `imageSrc` (which still renders
   * underneath, as the poster frame and the fallback if the video fails to
   * load). Empty/unset means image-only, same as before this field
   * existed. */
  videoSrc?: string;
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
 * `HeaderClient`'s optional props exactly. A nav link's `children` (a
 * dropdown submenu, e.g. under "Services") is optional and only present
 * on links that have one. */
export interface HeaderNavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export interface HeaderSectionData {
  logoImageSrc: string;
  phone: string;
  navLinks: HeaderNavLink[];
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

/** Multi-City Flights landing page (`multi-city-flights` template) — one
 * interface per component, in the order `app/multi-city-flights/page.tsx`
 * renders them. */
export interface McHeroSectionData {
  headingLines: string[];
  paragraphs: string[];
  backgroundImage: string;
  buttonLabel: string;
  buttonHref: string;
  phoneNumber: string;
  phoneHeaderImage: string;
  trustStats: { id: string; value: string; label: string }[];
}

export interface McExpertGuidanceSectionData {
  heading: string;
  paragraphs: string[];
  tags: string[];
  buttonLabel: string;
  buttonHref: string;
  imageSrc: string;
}

export interface McFlightOptionsSectionData {
  heading: string;
  subheading: string;
  cards: { id: string; title: string; description: string; image: string; alt: string }[];
}

/** `items` mirrors `SupportSectionData.items` (`string[][]`, two fixed
 * columns) exactly — same admin editor special case, different visual
 * treatment (full-bleed background image instead of image-beside-text). */
export interface McComplexitySectionData {
  heading: string;
  subheading: string;
  items: string[][];
  backgroundImage: string;
}

export interface McPlanningFactorsSectionData {
  heading: string;
  subheading: string;
  items: { id: string; label: string; description: string }[];
}

export interface McWorkAroundYouSectionData {
  headingLines: string[];
  paragraphs: string[];
  backgroundImage: string;
}

/** Shared shape behind the two alternating "featured" blocks and the
 * planning CTA block — all three are `ImageTextBlock` instances (see
 * `components/business-class/ImageTextBlock.tsx`), differing only in
 * `imagePosition` and image count, which the page passes literally rather
 * than storing in the data (same convention `BC_OPTIONS_ONE_WAY`/
 * `BC_OPTIONS_MULTI_CITY` already use). `twoColumnItems` mirrors
 * `McComplexitySectionData.items`'s two-fixed-columns shape. Also reused
 * by the First Class page's own `ImageTextBlock` instances (`FC_*`) — see
 * that page's section types below — which is why `benefits` (the other of
 * `ImageTextBlock`'s two optional list styles) and `buttonVariant` are
 * included even though no `MC_*` section currently sets them. */
export interface McImageTextSectionData {
  headingLines: string[];
  body: string;
  images: { src: string; alt: string }[];
  benefits?: string[];
  twoColumnItems?: string[][];
  buttonLabel?: string;
  buttonHref?: string;
  buttonVariant?: "navy" | "gold";
}

export interface McRoutesSectionData {
  heading: string;
  subheading: string;
  routes: { id: string; number: string; tag: string; stops: string }[];
  noticeText: string;
  buttonLabel: string;
  buttonHref: string;
}

export interface McExploreEuropeSectionData {
  headingLines: string[];
  subheading: string;
  buttonLabel: string;
  buttonHref: string;
  backgroundImage: string;
  rightHeading: string;
  rightBody: string;
}

export interface McWhyChooseSectionData {
  heading: string;
  features: { id: string; title: string; description: string }[];
}

/** First Class landing page (`first-class` template) — one interface per
 * component, in the order `app/first-class/page.tsx` renders them.
 * `FC_HERO` reuses `McHeroSectionData` (same `MultiCityHero` component),
 * `FC_EXPERT_GUIDANCE` reuses `McExpertGuidanceSectionData`, `FC_WHAT_MATTERS`/
 * `FC_PLANNING` reuse `McPlanningFactorsSectionData`, `FC_OPTIONS` reuses
 * `McFlightOptionsSectionData`, `FC_HOW_IT_WORKS` reuses
 * `BcHowItWorksSectionData`, `FC_WHY_CHOOSE` reuses `McWhyChooseSectionData`,
 * and `FC_FLIGHT_SEARCH_CHALLENGE`/`FC_BEFORE_BOOKING`/
 * `FC_BOARDING_EXPERIENCE`/`FC_JOURNEY_PREFERENCES` reuse
 * `McImageTextSectionData` — none of those get their own interface below. */
export interface FcComparisonSectionData {
  headingLines: string[];
  subheading: string;
  body: string;
  backgroundImage: string;
  columnLabels: [string, string];
  rows: { id: string; label: string; businessClass: string; firstClass: string }[];
}

export interface FcAirlinesSectionData {
  heading: string;
  subheading: string;
  airlines: { id: string; title: string; description: string; image: string; alt: string; linkLabel: string; linkHref: string }[];
}

export interface FcCabinSectionData {
  heading: string;
  body: string;
  subheading: string;
  twoColumnItems: string[][];
  image: string;
  imageAlt: string;
}

export interface FcAircraftSectionData {
  headingLines: string[];
  leftParagraphs: string[];
  rightParagraphs: string[];
  backgroundImage: string;
}

export interface FcFareSectionData {
  heading: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
  backgroundImage: string;
  subheading: string;
  twoColumnItems: string[][];
}

/** Deliberately not `RouteDeal` (whose `multiCityRoute` is a real `string[]`
 * of stops) — this page's route cards show one descriptive sentence under
 * the origin/destination instead, so `multiCityRoute` here is a plain
 * `string`. `app/first-class/page.tsx` wraps it in a single-element array
 * when handing routes to the reused `RoutesCarousel` (whose `.join(" → ")`
 * on a one-element array just renders that sentence unchanged, with no
 * arrow). `tagline` is the small italic line under the price — the one
 * field these cards have that `RoutesCarousel`'s normal cards don't. */
export interface FcRouteDeal {
  id: string;
  originCity: string;
  destinationCity: string;
  multiCityRoute: string;
  price: string;
  image: string;
  alt: string;
  href: string;
  tagline?: string;
}

export interface FcRoutesSectionData {
  heading: string;
  subheading: string;
  routes: FcRouteDeal[];
}

export interface FcPlanCtaSectionData {
  heading: string;
  subheading: string;
  buttonLabel: string;
  buttonHref: string;
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
  MC_HERO: McHeroSectionData;
  MC_EXPERT_GUIDANCE: McExpertGuidanceSectionData;
  MC_FLIGHT_OPTIONS: McFlightOptionsSectionData;
  MC_COMPLEXITY: McComplexitySectionData;
  MC_PLANNING_FACTORS: McPlanningFactorsSectionData;
  MC_HOW_IT_WORKS: BcHowItWorksSectionData;
  MC_WORK_AROUND_YOU: McWorkAroundYouSectionData;
  MC_FEATURED_ONE: McImageTextSectionData;
  MC_FEATURED_TWO: McImageTextSectionData;
  MC_ROUTES: McRoutesSectionData;
  MC_EXPLORE_EUROPE: McExploreEuropeSectionData;
  MC_WHY_CHOOSE: McWhyChooseSectionData;
  MC_PLANNING_CTA: McImageTextSectionData;
  FC_HERO: McHeroSectionData;
  FC_EXPERT_GUIDANCE: McExpertGuidanceSectionData;
  FC_WHAT_MATTERS: McPlanningFactorsSectionData;
  FC_FLIGHT_SEARCH_CHALLENGE: McImageTextSectionData;
  FC_OPTIONS: McFlightOptionsSectionData;
  FC_COMPARISON: FcComparisonSectionData;
  FC_AIRLINES: FcAirlinesSectionData;
  FC_CABIN: FcCabinSectionData;
  FC_HOW_IT_WORKS: BcHowItWorksSectionData;
  FC_AIRCRAFT: FcAircraftSectionData;
  FC_BEFORE_BOOKING: McImageTextSectionData;
  FC_BOARDING_EXPERIENCE: McImageTextSectionData;
  FC_FARE: FcFareSectionData;
  FC_ROUTES: FcRoutesSectionData;
  FC_PLANNING: McPlanningFactorsSectionData;
  FC_WHY_CHOOSE: McWhyChooseSectionData;
  FC_JOURNEY_PREFERENCES: McImageTextSectionData;
  FC_PLAN_CTA: FcPlanCtaSectionData;
  FC_FAQ: FaqSectionData;
}

export type SectionType = keyof SectionDataByType;
