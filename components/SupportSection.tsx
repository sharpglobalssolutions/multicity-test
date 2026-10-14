import Image from "next/image";
import Link from "next/link";
import { SectionReveal } from "@/components/SectionReveal";
import { SUPPORT_ITEMS, SUPPORT_SPECIALIST_IMAGE } from "@/data/content";

const DEFAULT_PARAGRAPHS = [
  "International travel doesn't always go according to plan. Flights get rescheduled. Connections are missed. Travel dates change. Unexpected situations can turn a straightforward journey into a stressful one. That's why access to human support matters.",
  "Our travel specialists provide 24×7 travel assistance for eligible travel requirements, including:",
];

const DEFAULT_CLOSING_PARAGRAPH =
  "Whether you're travelling for business, managing a complex multi-city itinerary or dealing with an unexpected change, our team is available to help you understand the options available to you.";

/** `items` is a plain two-column text list (see `SupportSectionData` —
 * the same shape/admin editor several other sections reuse, see
 * `types/page-sections.ts`), so there's nowhere to store a per-item link
 * without a wider, shared-type change. Mapping known labels to their
 * matching service page here instead keeps this scoped to this one
 * section; an item the admin renames to something not listed here just
 * renders as plain text, never a broken link. */
const ITEM_LINKS: Record<string, string> = {
  "Flight changes": "/flight-change",
  "Date changes": "/date-change-assistance",
  Rebooking: "/flight-change",
  "Schedule changes": "/schedule-changes",
  "Missed flights": "/missed-flight-assistance",
  "Missed connections": "/missed-flight-assistance",
  Cancellations: "/flight-cancellation",
  "Urgent travel requirements": "/last-minute-flights",
};

export interface SupportSectionProps {
  heading?: string;
  paragraphs?: string[];
  items?: string[][];
  imageSrc?: string;
  /** Shown below the two-column items list — unset renders nothing, same
   * as before this field existed. */
  closingParagraph?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function SupportSection({
  heading = "Get 24×7 Support When Your Travel Plans Change",
  paragraphs = DEFAULT_PARAGRAPHS,
  items = SUPPORT_ITEMS.map((column) => [...column]),
  imageSrc = SUPPORT_SPECIALIST_IMAGE.src,
  closingParagraph = DEFAULT_CLOSING_PARAGRAPH,
  buttonLabel = "Need Travel Assistance? Call Us",
  buttonHref = "tel:1869-504-657",
}: SupportSectionProps = {}) {
  return (
    // overflow-x-hidden: see BusinessClassSection — clips the SectionReveal
    // x-offset slide-in so it can never cause page-level horizontal scroll.
    <section className="overflow-x-hidden bg-white py-10 sm:py-12">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-60} className="lg:order-1">
          <h2 className="text-2xl font-semibold text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`max-w-lg text-[16px] leading-relaxed text-text-gray ${index === 0 ? "mt-5" : "mt-4"}`}
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 max-w-lg">
            {items.map((column, columnIndex) => (
              <ul key={columnIndex} className="space-y-3">
                {column.map((item) => {
                  const href = ITEM_LINKS[item];
                  return (
                    <li key={item} className="text-[16px] font-medium text-navy-deep">
                      {href ? (
                        <Link href={href} className="transition-colors hover:text-emerald hover:underline">
                          {item}
                        </Link>
                      ) : (
                        item
                      )}
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>

          {closingParagraph ? <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-text-gray">{closingParagraph}</p> : null}

          {buttonLabel ? (
            <div className="mt-6">
              <Link
                href={buttonHref}
                className="inline-flex items-center rounded-full bg-navy-deep px-7 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-navy-dark"
              >
                {buttonLabel}
              </Link>
            </div>
          ) : null}
        </SectionReveal>

        <SectionReveal x={60} delay={0.1} className="lg:order-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
            <Image
              src={imageSrc}
              alt={SUPPORT_SPECIALIST_IMAGE.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
