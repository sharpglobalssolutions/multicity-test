import type { SectionType } from "@/types/page-sections";

/** A single scalar input. `"string-list"` is an array of plain strings
 * (e.g. `airlines`), editable as an add/remove/reorder list of one-line
 * text fields — distinct from `"list"`, an array of objects. */
export type ScalarFieldKind = "text" | "textarea" | "image" | "string-list" | "richtext";

export interface ScalarFieldSchema {
  key: string;
  label: string;
  kind: ScalarFieldKind;
  /** `"textarea"` only — visible row count. Defaults to 4 when omitted. */
  rows?: number;
}

/** An array-of-objects field (e.g. `deals`, `testimonials`) — rendered as
 * a repeatable card, each with its own `itemFields`. */
export interface ListFieldSchema {
  key: string;
  label: string;
  kind: "list";
  itemFields: ScalarFieldSchema[];
  /** Fields for a freshly-added item — same keys as `itemFields`, empty
   * string values. */
  emptyItem: Record<string, string>;
}

export type FieldSchema = ScalarFieldSchema | ListFieldSchema;

const text = (key: string, label: string): ScalarFieldSchema => ({ key, label, kind: "text" });
const textarea = (key: string, label: string, rows?: number): ScalarFieldSchema => ({
  key,
  label,
  kind: "textarea",
  rows,
});
const image = (key: string, label: string): ScalarFieldSchema => ({ key, label, kind: "image" });
const stringList = (key: string, label: string): ScalarFieldSchema => ({ key, label, kind: "string-list" });
const richtext = (key: string, label: string): ScalarFieldSchema => ({ key, label, kind: "richtext" });

/** One field-schema list per `SECTION_TYPE` — drives the single generic
 * `SectionEditorDialog` instead of 16 bespoke forms. `SUPPORT`'s two-column
 * `items` field (`string[][]`) is handled as a small special case directly
 * in the dialog (flattened to two `string-list` sub-fields), not modeled
 * generically here — the only section shaped that way. */
export const SECTION_FIELD_SCHEMAS: Record<SectionType, FieldSchema[]> = {
  HERO: [
    { key: "headingLines", label: "Heading (one line per entry)", kind: "string-list" },
    richtext("subheading", "Subheading"),
    image("imageSrc", "Background image"),
    text("primaryButtonLabel", "Primary button label"),
    text("primaryButtonHref", "Primary button link"),
    text("secondaryButtonLabel", "Secondary button label"),
    text("secondaryButtonHref", "Secondary button link"),
  ],
  PARTNER_STRIP: [stringList("airlines", "Airline names")],
  DEALS: [
    text("heading", "Heading"),
    richtext("subheading", "Subheading"),
    {
      key: "deals",
      label: "Deals",
      kind: "list",
      itemFields: [text("id", "ID"), text("city", "City"), text("price", "Price"), image("image", "Image"), text("alt", "Image alt text")],
      emptyItem: { id: "", city: "", price: "", image: "", alt: "" },
    },
  ],
  BUSINESS_CLASS: [
    text("heading", "Heading"),
    richtext("body", "Body"),
    {
      key: "images",
      label: "Images",
      kind: "list",
      itemFields: [image("src", "Image"), text("alt", "Alt text")],
      emptyItem: { src: "", alt: "" },
    },
  ],
  PERSONALIZED_JOURNEY: [
    text("heading", "Heading"),
    richtext("body", "Body"),
    {
      key: "images",
      label: "Images",
      kind: "list",
      itemFields: [image("src", "Image"), text("alt", "Alt text")],
      emptyItem: { src: "", alt: "" },
    },
  ],
  STATISTICS: [
    {
      key: "stats",
      label: "Stats",
      kind: "list",
      itemFields: [text("id", "ID"), text("value", "Value (number)"), text("suffix", "Suffix"), text("label", "Label")],
      emptyItem: { id: "", value: "0", suffix: "", label: "" },
    },
  ],
  TRAVEL_ADVISOR: [
    text("heading", "Heading"),
    { key: "paragraphs", label: "Paragraphs", kind: "string-list" },
    image("imageSrc", "Image"),
    text("buttonLabel", "Button label"),
    text("buttonHref", "Button link"),
  ],
  SERVICES: [
    text("heading", "Heading"),
    richtext("subheading", "Subheading"),
    {
      key: "services",
      label: "Services",
      kind: "list",
      itemFields: [
        text("id", "ID"),
        text("category", "Category"),
        text("title", "Title"),
        textarea("description", "Description"),
        image("image", "Image"),
        text("alt", "Image alt text"),
        text("href", "Link"),
      ],
      emptyItem: { id: "", category: "", title: "", description: "", image: "", alt: "", href: "" },
    },
  ],
  SUPPORT: [
    text("heading", "Heading"),
    { key: "paragraphs", label: "Paragraphs", kind: "string-list" },
    image("imageSrc", "Image"),
  ],
  EXPERTS: [
    text("heading", "Heading"),
    text("subtitle1", "Subtitle (bold line)"),
    richtext("subtitle2", "Subtitle (regular line)"),
    image("backgroundImage", "Background image"),
    {
      key: "features",
      label: "Features",
      kind: "list",
      itemFields: [
        text("id", "ID"),
        text("title", "Title"),
        textarea("description", "Description"),
        text("icon", "Icon key (headset, route, armchair, shield-check, users)"),
      ],
      emptyItem: { id: "", title: "", description: "", icon: "headset" },
    },
  ],
  TESTIMONIALS: [
    text("heading", "Heading"),
    richtext("subheading", "Subheading"),
    {
      key: "testimonials",
      label: "Testimonials",
      kind: "list",
      itemFields: [
        text("id", "ID"),
        textarea("quote", "Quote"),
        text("name", "Name"),
        text("location", "Location"),
        text("rating", "Rating (1-5)"),
        image("avatar", "Avatar"),
      ],
      emptyItem: { id: "", quote: "", name: "", location: "", rating: "5", avatar: "" },
    },
  ],
  FAQ: [
    text("eyebrow", "Eyebrow"),
    text("heading", "Heading"),
    {
      key: "faqs",
      label: "Questions",
      kind: "list",
      itemFields: [text("id", "ID"), text("question", "Question"), textarea("answer", "Answer")],
      emptyItem: { id: "", question: "", answer: "" },
    },
  ],
  INSIGHTS: [text("heading", "Heading"), richtext("subheading", "Subheading")],
  ROUTES: [
    text("heading", "Heading"),
    richtext("subheading", "Subheading"),
    {
      key: "routes",
      label: "Routes",
      kind: "list",
      itemFields: [
        text("id", "ID"),
        image("image", "Image"),
        text("alt", "Image alt text"),
        text("originCity", "Origin city"),
        text("destinationCity", "Destination city"),
        text("price", "Price"),
        text("href", "Link"),
      ],
      emptyItem: { id: "", image: "", alt: "", originCity: "", destinationCity: "", price: "", href: "" },
    },
  ],
  CTA: [
    text("heading", "Heading"),
    richtext("body", "Body"),
    text("buttonLabel", "Button label"),
    text("buttonHref", "Button link"),
    image("backgroundImage", "Background image"),
  ],
  SOCIAL: [text("heading", "Heading")],
  POLICY_CONTENT: [
    text("subtitle", "Category / breadcrumb (e.g. \"Legal · MultiCityExperts\")"),
    image("bannerImage", "Hero banner image"),
    richtext("content", "Content (headings become the table of contents automatically)"),
  ],
};
