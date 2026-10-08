import { z } from "zod";

/** The fixed set of section types this platform renders. Kept as a Zod
 * enum rather than a Prisma enum — `PageSection.sectionType` stays a plain
 * string column (see prisma/schema.prisma), matching this project's
 * convention of validating closed content vocabularies at the Zod layer
 * instead of migrating the database every time the set changes.
 *
 * One value per homepage component, in the order `app/page.tsx` renders
 * them: DEALS = DestinationCarousel, ROUTES = RoutesCarousel, INSIGHTS =
 * TravelInsights, CTA = FinalCTA. */
export const SECTION_TYPES = [
  "HERO",
  "PARTNER_STRIP",
  "DEALS",
  "BUSINESS_CLASS",
  "PERSONALIZED_JOURNEY",
  "STATISTICS",
  "TRAVEL_ADVISOR",
  "SERVICES",
  "SUPPORT",
  "EXPERTS",
  "TESTIMONIALS",
  "FAQ",
  "INSIGHTS",
  "ROUTES",
  "CTA",
  "SOCIAL",
  /** A single markdown content block for the "Policy Page" template (see
   * `components/PolicyPageTemplate.tsx`) — `subtitle` holds the hero
   * category/breadcrumb text (e.g. "Legal · MultiCityExperts"), `content`
   * holds the raw markdown body the TOC and main content are both
   * derived from. */
  "POLICY_CONTENT",
  /** Site-wide chrome, not homepage content — these two live on the one
   * hidden singleton "chrome" page (`services/chrome.service.ts`) instead
   * of any real content page, and render on every route via `Header`/
   * `Footer` rather than a specific page's `<main>`. */
  "HEADER",
  "FOOTER",
  /** The Business Class landing page (`business-class` template) — one
   * value per component, in the order `app/business-class/page.tsx`
   * renders them. `BC_OPTIONS` is just the shared heading above the two
   * `ImageTextBlock` instances (`BC_OPTIONS_ONE_WAY`/`BC_OPTIONS_MULTI_CITY`).
   * `CTA`/`TESTIMONIALS`/`FAQ` above are reused here too — sections are
   * scoped by `pageId`, so a fresh instance of those types on this page's
   * `Page` row is independent of the homepage's own. */
  "BC_HERO",
  "BC_QUICK_CONSULT",
  "BC_STATS",
  "BC_OPTIONS",
  "BC_OPTIONS_ONE_WAY",
  "BC_OPTIONS_MULTI_CITY",
  "BC_FARE_COMPLEXITY",
  "BC_BEYOND_PRICE",
  "BC_HOW_IT_WORKS",
  "BC_JOURNEY",
  "BC_SERVICES",
  "BC_EXPERTISE",
  /** The Multi-City Flights landing page (`multi-city-flights` template) —
   * one value per component, in the order `app/multi-city-flights/page.tsx`
   * renders them. `CTA`/`FAQ` above are reused here too, scoped to this
   * page's own `Page` row same as the Business Class page does. */
  "MC_HERO",
  "MC_EXPERT_GUIDANCE",
  "MC_FLIGHT_OPTIONS",
  "MC_COMPLEXITY",
  "MC_PLANNING_FACTORS",
  "MC_HOW_IT_WORKS",
  "MC_WORK_AROUND_YOU",
  "MC_FEATURED_ONE",
  "MC_FEATURED_TWO",
  "MC_ROUTES",
  "MC_EXPLORE_EUROPE",
  "MC_WHY_CHOOSE",
  "MC_PLANNING_CTA",
  /** The First Class landing page (`first-class` template) — one value per
   * component, in the order `app/first-class/page.tsx` renders them.
   * `FC_HERO` reuses `MC_HERO`'s exact data shape (rendered by the same
   * `MultiCityHero` component — see that component's doc comment) and
   * several other FC_* types reuse MC_* and BC_* shapes the same way;
   * `CTA` above is reused too, scoped to this page's own `Page` row. */
  "FC_HERO",
  "FC_EXPERT_GUIDANCE",
  "FC_WHAT_MATTERS",
  "FC_FLIGHT_SEARCH_CHALLENGE",
  "FC_OPTIONS",
  "FC_COMPARISON",
  "FC_AIRLINES",
  "FC_CABIN",
  "FC_HOW_IT_WORKS",
  "FC_AIRCRAFT",
  "FC_BEFORE_BOOKING",
  "FC_BOARDING_EXPERIENCE",
  "FC_FARE",
  "FC_ROUTES",
  "FC_PLANNING",
  "FC_WHY_CHOOSE",
  "FC_JOURNEY_PREFERENCES",
  "FC_PLAN_CTA",
  "FC_FAQ",
  /** The Flight Cancellation Assistance landing page (`flight-cancellation`
   * template) — one value per component, in the order
   * `app/flight-cancellation/page.tsx` renders them. Several reuse MC_* and
   * BC_* shapes the same way the FC_* block above does; `CTA` is reused
   * here too, scoped to this page's own `Page` row. */
  "CNX_HERO",
  "CNX_INTRO",
  "CNX_WHY_CANCEL",
  "CNX_CHECK_OPTIONS",
  "CNX_CANCEL_VS_REBOOK",
  "CNX_REFUND_VS_CREDIT",
  "CNX_REFUND_BLOCK",
  "CNX_CREDIT_BLOCK",
  "CNX_CREDIT_BANNER",
  "CNX_SCHEDULE_CHANGE",
  "CNX_ENTIRE_BOOKING",
  "CNX_BEFORE_CANCELLING",
  "CNX_FARE_WARNING",
  "CNX_PREMIUM_CABIN",
  "CNX_HOW_IT_WORKS",
  "CNX_NOT_SURE",
  "CNX_WHY_CHOOSE",
  "CNX_NOT_ONLY_OPTION",
  "CNX_REVIEW_INFO",
  "CNX_REVIEW_STEPS",
  "CNX_PLAN_CTA",
  "CNX_FAQ",
  /** The Flight Change Assistance landing page (`flight-change` template) —
   * one value per component, in the order `app/flight-change/page.tsx`
   * renders them. Almost entirely reuses MC_*, BC_* and CNX_* shapes the
   * same way the CNX_* block above reuses MC_* and BC_* ones; `CTA` is
   * reused here too, scoped to this page's own `Page` row. */
  "FCH_HERO",
  "FCH_EXPERT_GUIDANCE",
  "FCH_OPTIONS_CHANGE",
  "FCH_BEFORE_CHANGE",
  "FCH_HOW_WE_HELP",
  "FCH_SCENARIOS",
  "FCH_FARE_OPTIONS",
  "FCH_PROCESS",
  "FCH_EXPERTS_HELP",
  "FCH_NOT_SURE_BANNER",
  "FCH_BUSINESS_CLASS_CHANGES",
  "FCH_MULTICITY_CHANGE",
  "FCH_WHY_CHOOSE",
  "FCH_CINEMATIC_CTA",
  "FCH_REVIEW_INFO",
  "FCH_FAQ",
  /** The International Flight Booking Assistance landing page
   * (`international-flight-booking` template) — one value per component,
   * in the order `app/international-flight-booking/page.tsx` renders
   * them. Almost entirely reuses MC_*, BC_* and CNX_* shapes the same way
   * the FCH_* block above does; `CTA` is reused here too, scoped to this
   * page's own `Page` row. */
  "IFB_HERO",
  "IFB_EXPERT_GUIDANCE",
  "IFB_FLIGHT_PRICE",
  "IFB_JOURNEY_TYPES",
  "IFB_ROUTES",
  "IFB_AIRLINES",
  "IFB_FARE_GUIDANCE",
  "IFB_BEFORE_CONFIRM",
  "IFB_PERSONAL_PROCESS",
  "IFB_WHO_WE_HELP",
  "IFB_WHY_CHOOSE",
  "IFB_BEYOND_SEARCH",
  "IFB_REVIEW_INFO",
  "IFB_FAQ",
  /** The Missed Flight Assistance landing page (`missed-flight-assistance`
   * template) — one value per component, in the order
   * `app/missed-flight-assistance/page.tsx` renders them. Entirely reuses
   * MC_*, BC_* and CNX_* shapes the same way the IFB_* block above does;
   * `CTA` is reused here too, scoped to this page's own `Page` row. */
  "MF_HERO",
  "MF_INTRO",
  "MF_HELP_WITH",
  "MF_BEFORE_BOOK",
  "MF_WHY_MISS",
  "MF_OPTIONS",
  "MF_BUSINESS_CLASS",
  "MF_MULTI_CITY",
  "MF_HOW_WE_HELP",
  "MF_URGENT_HELP",
  "MF_WHY_CHOOSE",
  "MF_INFO_READY",
  "MF_REVIEW_CTA",
  "MF_FAQ",
  /** The Last-Minute Flights landing page (`last-minute-flights` template)
   * — one value per component, in the order
   * `app/last-minute-flights/page.tsx` renders them. Entirely reuses
   * MC_*, BC_* and CNX_* shapes the same way the MF_* block above does;
   * `CTA` is reused here too, scoped to this page's own `Page` row. */
  "LMF_HERO",
  "LMF_INTRO",
  "LMF_HELP_WITH",
  "LMF_OPTIONS",
  "LMF_WHY_SPECIALIST",
  "LMF_BUSINESS_CLASS",
  "LMF_WHY_CHOOSE",
  "LMF_FAQ",
  /** The Date Change Assistance landing page (`date-change-assistance`
   * template) — one value per component, in the order
   * `app/date-change-assistance/page.tsx` renders them. Entirely reuses
   * MC_*, BC_* and CNX_* shapes the same way the LMF_* block above does,
   * aside from `DC_REQUEST_FORM`'s own shape; `CTA` is reused here too,
   * scoped to this page's own `Page` row. */
  "DC_HERO",
  "DC_EXPERT_GUIDANCE",
  "DC_UNDERSTANDING_OPTIONS",
  "DC_BEFORE_CHANGE",
  "DC_COMMON_REASONS",
  "DC_FARE_RULES",
  "DC_WHY_DATE_MATTERS",
  "DC_BUSINESS_CLASS",
  "DC_MULTI_CITY",
  "DC_URGENT_HELP",
  "DC_HOW_IT_WORKS",
  "DC_WHY_CHOOSE",
  "DC_INFO_NEEDED",
  "DC_REQUEST_FORM",
  "DC_FAQ",
  /** The Airline Schedule Change Assistance landing page
   * (`schedule-changes` template) — one value per component, in the order
   * `app/schedule-changes/page.tsx` renders them. Entirely reuses MC_*,
   * BC_* and CNX_* shapes the same way the DC_* block above does; `CTA`
   * is reused here too, scoped to this page's own `Page` row. */
  "SC_HERO",
  "SC_WHAT_MEANS",
  "SC_TYPES",
  "SC_BEFORE_ACCEPT",
  "SC_HOW_WE_HELP",
  "SC_SCENARIOS",
  "SC_OPTIONS",
  "SC_MULTI_CITY",
  "SC_BUSINESS_CLASS",
  "SC_ONE_WAY",
  "SC_URGENT_HELP",
  "SC_HOW_IT_WORKS",
  "SC_WHY_CHOOSE",
  "SC_INFO_NEEDED",
  "SC_REVIEW_CTA",
  "SC_FAQ",
  /** The Flight Name Correction Assistance landing page
   * (`name-correction` template) — one value per component, in the order
   * `app/name-correction/page.tsx` renders them. Entirely reuses MC_*,
   * BC_* and CNX_* shapes the same way the SC_* block above does; `CTA`
   * is reused here too, scoped to this page's own `Page` row. */
  "NC_HERO",
  "NC_INTRO",
  "NC_HOW_WE_HELP",
  "NC_BEFORE_REQUEST",
  "NC_SCENARIOS",
  "NC_POLICIES_TABLE",
  "NC_CORRECTION_VS_CHANGE",
  "NC_INTERNATIONAL",
  "NC_BUSINESS_CLASS",
  "NC_MULTI_CITY",
  "NC_HOW_IT_WORKS",
  "NC_URGENT",
  "NC_BOOKED_ELSEWHERE",
  "NC_TIPS",
  "NC_WHY_CHOOSE",
  "NC_INFO_NEEDED",
  "NC_REQUEST_FORM",
  "NC_FAQ",
  /** The Business Travel Partnerships (B2B) landing page
   * (`business-partnerships` template) — one value per component, in the
   * order `app/business-partnerships/page.tsx` renders them. Entirely
   * reuses MC_*, BC_* and CNX_* shapes the same way the NC_* block above
   * does; `CTA` is reused here too, scoped to this page's own `Page` row.
   * Unlike every other service page, its hero (`BP_HERO`) reuses
   * `CancellationHero` rather than `MultiCityHero` — this page is a B2B
   * partnership enquiry, not an individual flight search, so the quote
   * form doesn't apply. */
  "BP_HERO",
  "BP_INTRO",
  "BP_VALUE",
  "BP_WHO_WE_SUPPORT",
  "BP_FITS_WORKFLOW",
  "BP_MODELS",
  "BP_EXPERIENCE",
  "BP_ITINERARIES",
  "BP_MORE_THAN_FARE",
  "BP_HOW_IT_WORKS",
  "BP_STRENGTHS",
  "BP_WHY_CHOOSE",
  "BP_MID_CTA",
  "BP_FAQ",
  "BP_DISCLAIMER",
] as const;

export const sectionTypeSchema = z.enum(SECTION_TYPES);

/** `PageSection.data` is intentionally freeform JSON — its shape varies
 * per `sectionType` (see the model's doc comment) — so this only enforces
 * that it's a plain JSON object, not a specific per-type structure. */
const sectionDataSchema = z.record(z.string(), z.unknown());

export const createPageSectionSchema = z.object({
  sectionType: sectionTypeSchema,
  title: z.string().trim().min(1, "Title is required").optional(),
  subtitle: z.string().trim().min(1, "Subtitle is required").optional(),
  content: z.string().trim().min(1, "Content is required").optional(),
  data: sectionDataSchema.optional(),
  /** Omit to append at the end of the page's current sections. */
  sortOrder: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type CreatePageSectionInput = z.infer<typeof createPageSectionSchema>;

/** Every field optional — a PATCH updates only what's supplied — but at
 * least one must be present, or there's nothing to do. Bulk position
 * changes go through `reorderPageSectionsSchema` below, not `sortOrder`
 * here, to keep a single section's edit from silently shuffling others. */
export const updatePageSectionSchema = z
  .object({
    sectionType: sectionTypeSchema.optional(),
    title: z.string().trim().min(1, "Title is required").optional(),
    subtitle: z.string().trim().min(1, "Subtitle is required").optional(),
    content: z.string().trim().min(1, "Content is required").optional(),
    data: sectionDataSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdatePageSectionInput = z.infer<typeof updatePageSectionSchema>;

/** `sectionIds` must be the page's *entire* current section list, in the
 * new order — the service rejects a partial or foreign set rather than
 * guessing what should happen to an omitted section. */
export const reorderPageSectionsSchema = z.object({
  sectionIds: z.array(z.string().min(1)).min(1, "At least one section id is required"),
});

export type ReorderPageSectionsInput = z.infer<typeof reorderPageSectionsSchema>;

/** Params shape for routes nested under a page's sections that also
 * target one specific section (`PATCH`/`DELETE .../sections/:sectionId`). */
export const pageSectionParamsSchema = z.object({
  id: z.string().min(1, "id is required"),
  sectionId: z.string().min(1, "sectionId is required"),
});
