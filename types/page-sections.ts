import type { ExpertFeatureInput } from "@/components/ExpertsSection";
import type { BusinessClassServiceItem } from "@/components/business-class/BusinessClassServices";
import type { ExpertiseDestinationImage, ExpertiseRoute } from "@/components/business-class/BusinessClassExpertise";
import type { FareComplexityItem } from "@/components/business-class/FareComplexity";
import type { HowItWorksStep } from "@/components/business-class/HowItWorks";
import type { JourneySlide } from "@/components/business-class/JourneyCarousel";
import type { TravelAdvisorItem } from "@/components/TravelAdvisorSection";
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

/** `items` is optional (added for the homepage's expanded "Why Expert
 * Travel Advice" copy — a labelled list of ways a specialist adds value
 * beyond `paragraphs`'s intro text) — every prior caller omits it. */
export interface TravelAdvisorSectionData {
  heading: string;
  paragraphs: string[];
  items?: TravelAdvisorItem[];
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

/** `paragraph` is optional (added for the Flight Change page's dark
 * "Expert Guidance" instance, which has an extra descriptive paragraph
 * between `subheading` and the steps) — every existing caller omits it. */
export interface BcHowItWorksSectionData {
  heading: string;
  subheading: string;
  paragraph?: string;
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
/** `subheading` is optional (added for the Flight Change page's hero,
 * whose reference design has a second, smaller heading line between
 * `headingLines` and `paragraphs`) — every existing caller omits it. */
export interface McHeroSectionData {
  headingLines: string[];
  subheading?: string;
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
 * treatment (full-bleed background image instead of image-beside-text).
 * `listIntro` is optional (added for `CNX_NOT_SURE`'s "Simply tell us what
 * changed:" label above the list) — every existing caller omits it. */
export interface McComplexitySectionData {
  heading: string;
  subheading: string;
  items: string[][];
  backgroundImage: string;
  listIntro?: string;
}

export interface McPlanningFactorsSectionData {
  heading: string;
  subheading: string;
  items: { id: string; label: string; description: string }[];
}

/** `rightParagraphs` is optional (added for the International Flight
 * Booking page's "International Travel Planning Beyond a Standard Flight
 * Search" instance, whose reference design splits into two text columns)
 * — every existing caller omits it. */
export interface McWorkAroundYouSectionData {
  headingLines: string[];
  paragraphs: string[];
  rightParagraphs?: string[];
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
export interface McImageTextTitledItem {
  title: string;
  description: string;
}

export interface McImageTextSectionData {
  headingLines: string[];
  body: string;
  images: { src: string; alt: string }[];
  benefits?: string[];
  twoColumnItems?: string[][];
  /** A third, richer list style alongside `benefits`/`twoColumnItems` — a
   * two-column grid of title+description pairs rather than plain bullet
   * phrases. Added for the Flight Change page's "How Our Flight Change
   * Assistance Works" process steps; at most one of the three list props
   * is expected to be set at a time. */
  titledItems?: McImageTextTitledItem[];
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

/** Flight Cancellation Assistance landing page (`flight-cancellation`
 * template) — one interface per component, in the order
 * `app/flight-cancellation/page.tsx` renders them. `CNX_INTRO`/
 * `CNX_ENTIRE_BOOKING`/`CNX_PREMIUM_CABIN`/`CNX_REFUND_BLOCK`/
 * `CNX_CREDIT_BLOCK` reuse `McImageTextSectionData`, `CNX_WHY_CANCEL`/
 * `CNX_BEFORE_CANCELLING`/`CNX_WHY_CHOOSE` reuse `McPlanningFactorsSectionData`
 * (the page passes a literal `columns` prop, not stored in `data`, for the
 * two 4-column instances), `CNX_CHECK_OPTIONS` reuses `McWhyChooseSectionData`
 * (rendered with `cardStyle="bordered"`), `CNX_NOT_SURE` reuses
 * `McComplexitySectionData` (rendered with an empty `backgroundImage` for a
 * flat black section, and `align="center"`), `CNX_HOW_IT_WORKS` reuses
 * `BcHowItWorksSectionData`, `CNX_NOT_ONLY_OPTION` reuses `ServicesSectionData`,
 * and `CNX_FAQ` reuses `FaqSectionData` — none of those get their own
 * interface below. `CTA` (shared with every other page) supplies the final
 * cinematic banner. */
/** Deliberately its own shape, not a reuse of `McHeroSectionData` — this
 * page's hero (`CancellationHero`) has no quote-form card, phone header or
 * trust stats, just a cinematic photo with left-aligned text and a single
 * button (see that component's doc comment). */
/** `secondaryButtonLabel`/`secondaryButtonHref`/`trustLine` are optional —
 * added for the Missed Flight Assistance page's hero (a primary + secondary
 * CTA plus a small trust line). The Flight Cancellation page's own
 * instance omits all three. */
export interface CnxHeroSectionData {
  headingLines: string[];
  subheading: string;
  paragraph: string;
  buttonLabel: string;
  buttonHref: string;
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;
  trustLine?: string;
  backgroundImage: string;
}

export interface CnxComparisonSectionData {
  heading: string;
  subheading: string;
  groupOneHeading: string;
  /** Optional short intro line under the group heading — set on
   * `CNX_CANCEL_VS_REBOOK`, omitted on `CNX_REVIEW_INFO` (whose two groups
   * are a plain "Booking Details" / "What Changed?" heading pair with no
   * intro line). */
  groupOneIntro?: string;
  /** Newline-separated — same convention as `HowItWorksStep.titleLines`
   * (see `components/multi-city/HowItWorksCarousel.tsx`): the admin list
   * editor only models scalar fields, so a plain bullet column is stored
   * as one string and split at render time. */
  groupOneColumnA: string;
  groupOneColumnB: string;
  groupTwoHeading: string;
  groupTwoIntro?: string;
  groupTwoColumnA: string;
  groupTwoColumnB: string;
}

export interface CnxRefundVsCreditSectionData {
  heading: string;
  subheading: string;
}

export interface CnxInfoBannerSectionData {
  heading: string;
  body: string;
  /** Both optional — unset on `CNX_FARE_WARNING`, which is a plain
   * statement with no action to take. */
  buttonLabel?: string;
  buttonHref?: string;
}

/** `rightNote` is optional (a closing line below the two-column list —
 * added for the International Flight Booking page's "Popular North
 * Atlantic Routes" instance). `flowLabel`/`flowSteps` are also optional
 * (that same instance has no step sequence, unlike every prior caller,
 * which sets both). */
export interface CnxScheduleChangeSectionData {
  headingLines: string[];
  body: string;
  rightHeading: string;
  /** Newline-separated, same convention as `CnxComparisonSectionData`'s
   * columns. */
  rightColumnA: string;
  rightColumnB: string;
  rightNote?: string;
  flowLabel?: string;
  flowSteps?: string[];
  backgroundImage: string;
}

export interface CnxStepsCarouselStep {
  id: string;
  stepLabel: string;
  /** Newline-separated, same convention as `CnxComparisonSectionData`'s
   * columns. */
  items: string;
}

export interface CnxStepsCarouselSectionData {
  heading: string;
  subheading: string;
  steps: CnxStepsCarouselStep[];
}

export interface CnxCenteredCtaSectionData {
  heading: string;
  subheading: string;
  buttonLabel: string;
  buttonHref: string;
}

/** The Date Change Assistance page's centered CTA (`DateChangeCenteredCta`)
 * whose button opens `DateChangeRequestModal` — `heading`/`subheading`/
 * `buttonLabel` drive the CTA banner itself, `disclaimer` is passed through
 * to the modal. The modal's own form fields (airline, from/to, dates,
 * passengers, cabin, flexible dates, additional requirements) aren't
 * CMS-editable, same as `FlightSearch`'s fields aren't. */
export interface DcRequestFormSectionData {
  heading: string;
  subheading: string;
  buttonLabel: string;
  disclaimer: string;
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
  CNX_HERO: CnxHeroSectionData;
  CNX_INTRO: McImageTextSectionData;
  CNX_WHY_CANCEL: McPlanningFactorsSectionData;
  CNX_CHECK_OPTIONS: McWhyChooseSectionData;
  CNX_CANCEL_VS_REBOOK: CnxComparisonSectionData;
  CNX_REFUND_VS_CREDIT: CnxRefundVsCreditSectionData;
  CNX_REFUND_BLOCK: McImageTextSectionData;
  CNX_CREDIT_BLOCK: McImageTextSectionData;
  CNX_CREDIT_BANNER: CnxInfoBannerSectionData;
  CNX_SCHEDULE_CHANGE: CnxScheduleChangeSectionData;
  CNX_ENTIRE_BOOKING: McImageTextSectionData;
  CNX_BEFORE_CANCELLING: McPlanningFactorsSectionData;
  CNX_FARE_WARNING: CnxInfoBannerSectionData;
  CNX_PREMIUM_CABIN: McImageTextSectionData;
  CNX_HOW_IT_WORKS: BcHowItWorksSectionData;
  CNX_NOT_SURE: McComplexitySectionData;
  CNX_WHY_CHOOSE: McPlanningFactorsSectionData;
  CNX_NOT_ONLY_OPTION: ServicesSectionData;
  CNX_REVIEW_INFO: CnxComparisonSectionData;
  CNX_REVIEW_STEPS: CnxStepsCarouselSectionData;
  CNX_PLAN_CTA: CnxCenteredCtaSectionData;
  CNX_FAQ: FaqSectionData;
  FCH_HERO: McHeroSectionData;
  FCH_EXPERT_GUIDANCE: BcHowItWorksSectionData;
  FCH_OPTIONS_CHANGE: McImageTextSectionData;
  FCH_BEFORE_CHANGE: McPlanningFactorsSectionData;
  FCH_HOW_WE_HELP: BcHowItWorksSectionData;
  FCH_SCENARIOS: McPlanningFactorsSectionData;
  FCH_FARE_OPTIONS: McWhyChooseSectionData;
  FCH_PROCESS: McImageTextSectionData;
  FCH_EXPERTS_HELP: McImageTextSectionData;
  FCH_NOT_SURE_BANNER: CnxInfoBannerSectionData;
  FCH_BUSINESS_CLASS_CHANGES: McImageTextSectionData;
  FCH_MULTICITY_CHANGE: McImageTextSectionData;
  FCH_WHY_CHOOSE: McPlanningFactorsSectionData;
  FCH_CINEMATIC_CTA: CtaSectionData;
  FCH_REVIEW_INFO: McImageTextSectionData;
  FCH_FAQ: FaqSectionData;
  IFB_HERO: McHeroSectionData;
  IFB_EXPERT_GUIDANCE: McPlanningFactorsSectionData;
  IFB_FLIGHT_PRICE: McWhyChooseSectionData;
  IFB_JOURNEY_TYPES: ServicesSectionData;
  IFB_ROUTES: CnxScheduleChangeSectionData;
  IFB_AIRLINES: McPlanningFactorsSectionData;
  IFB_FARE_GUIDANCE: McImageTextSectionData;
  IFB_BEFORE_CONFIRM: McPlanningFactorsSectionData;
  IFB_PERSONAL_PROCESS: BcHowItWorksSectionData;
  IFB_WHO_WE_HELP: McImageTextSectionData;
  IFB_WHY_CHOOSE: McPlanningFactorsSectionData;
  IFB_BEYOND_SEARCH: McWorkAroundYouSectionData;
  IFB_REVIEW_INFO: McImageTextSectionData;
  IFB_FAQ: FaqSectionData;
  MF_HERO: McHeroSectionData;
  MF_INTRO: McImageTextSectionData;
  MF_HELP_WITH: McPlanningFactorsSectionData;
  MF_BEFORE_BOOK: McPlanningFactorsSectionData;
  MF_WHY_MISS: McComplexitySectionData;
  MF_OPTIONS: McWhyChooseSectionData;
  MF_BUSINESS_CLASS: McImageTextSectionData;
  MF_MULTI_CITY: McImageTextSectionData;
  MF_HOW_WE_HELP: BcHowItWorksSectionData;
  MF_URGENT_HELP: McComplexitySectionData;
  MF_WHY_CHOOSE: McPlanningFactorsSectionData;
  MF_INFO_READY: McImageTextSectionData;
  MF_REVIEW_CTA: CnxCenteredCtaSectionData;
  MF_FAQ: FaqSectionData;
  LMF_HERO: McHeroSectionData;
  LMF_INTRO: McImageTextSectionData;
  LMF_HELP_WITH: McPlanningFactorsSectionData;
  LMF_OPTIONS: McWhyChooseSectionData;
  LMF_WHY_SPECIALIST: McComplexitySectionData;
  LMF_BUSINESS_CLASS: McImageTextSectionData;
  LMF_WHY_CHOOSE: McPlanningFactorsSectionData;
  LMF_FAQ: FaqSectionData;
  DC_HERO: McHeroSectionData;
  DC_EXPERT_GUIDANCE: McPlanningFactorsSectionData;
  DC_UNDERSTANDING_OPTIONS: McPlanningFactorsSectionData;
  DC_BEFORE_CHANGE: McPlanningFactorsSectionData;
  DC_COMMON_REASONS: McWhyChooseSectionData;
  DC_FARE_RULES: McPlanningFactorsSectionData;
  DC_WHY_DATE_MATTERS: McComplexitySectionData;
  DC_BUSINESS_CLASS: McImageTextSectionData;
  DC_MULTI_CITY: McImageTextSectionData;
  DC_URGENT_HELP: McComplexitySectionData;
  DC_HOW_IT_WORKS: BcHowItWorksSectionData;
  DC_WHY_CHOOSE: McPlanningFactorsSectionData;
  DC_INFO_NEEDED: McImageTextSectionData;
  DC_REQUEST_FORM: DcRequestFormSectionData;
  DC_FAQ: FaqSectionData;
  SC_HERO: McHeroSectionData;
  SC_WHAT_MEANS: McImageTextSectionData;
  SC_TYPES: McPlanningFactorsSectionData;
  SC_BEFORE_ACCEPT: McPlanningFactorsSectionData;
  SC_HOW_WE_HELP: McWhyChooseSectionData;
  SC_SCENARIOS: McPlanningFactorsSectionData;
  SC_OPTIONS: McWhyChooseSectionData;
  SC_MULTI_CITY: McImageTextSectionData;
  SC_BUSINESS_CLASS: McImageTextSectionData;
  SC_ONE_WAY: McImageTextSectionData;
  SC_URGENT_HELP: McComplexitySectionData;
  SC_HOW_IT_WORKS: BcHowItWorksSectionData;
  SC_WHY_CHOOSE: McPlanningFactorsSectionData;
  SC_INFO_NEEDED: McImageTextSectionData;
  SC_REVIEW_CTA: CnxCenteredCtaSectionData;
  SC_FAQ: FaqSectionData;
}

export type SectionType = keyof SectionDataByType;
