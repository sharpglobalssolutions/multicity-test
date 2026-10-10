import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

export interface FirstClassComparisonRow {
  id: string;
  label: string;
  businessClass: string;
  firstClass: string;
}

const DEFAULT_ROWS: FirstClassComparisonRow[] = [
  { id: "seating", label: "Seating", businessClass: "Lie-flat or angled seats, varies by airline", firstClass: "Private suite or lie-flat seat on most long-haul aircraft" },
  { id: "privacy", label: "Privacy", businessClass: "Limited privacy, open cabin layout", firstClass: "Closing door or high partition on many aircraft" },
  { id: "cabin", label: "Cabin", businessClass: "Shared premium cabin", firstClass: "Smaller, more exclusive cabin" },
  { id: "dining", label: "Dining", businessClass: "Multi-course dining, set timing", firstClass: "On-demand dining, often restaurant-style service" },
  { id: "lounge", label: "Lounge", businessClass: "Business lounge access", firstClass: "First Class lounge, sometimes with dining and spa" },
  { id: "ground-services", label: "Ground Services", businessClass: "Priority check-in and boarding", firstClass: "Dedicated check-in, sometimes chauffeur service" },
  { id: "fare", label: "Fare", businessClass: "Lower fare, fewer restrictions on some routes", firstClass: "Higher fare, availability varies by route" },
  { id: "availability", label: "Availability", businessClass: "Offered on most long-haul international routes", firstClass: "Offered by a smaller number of airlines and aircraft" },
];

export interface FirstClassComparisonSectionProps {
  headingLines?: string[];
  subheading?: string;
  body?: string;
  backgroundImage?: string;
  columnLabels?: [string, string];
  rows?: FirstClassComparisonRow[];
}

/** A dark cinematic section pairing a short intro with a translucent
 * comparison table — its own component since nothing else on the site
 * renders a structured side-by-side comparison like this. All props
 * optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function FirstClassComparisonSection({
  headingLines = ["First Class vs", "Business Class:"],
  subheading = "Which Is Right for You?",
  body = "The difference between Business Class and First Class varies by airline, aircraft, route and cabin product.",
  backgroundImage = unsplash("1436491865332-7a61a109cc05"),
  columnLabels = ["Business Class", "First Class"],
  rows = DEFAULT_ROWS,
}: FirstClassComparisonSectionProps = {}) {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-10 sm:py-14">
      <Image src={backgroundImage} alt="An aircraft wing above the clouds during a sunset flight" fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-black/70" />

      <div className="content-container relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <SectionReveal x={-40}>
          <h2 className="text-2xl leading-tight text-white sm:text-4xl lg:text-[30px] font-semibold">
            {headingLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-2 text-2xl text-white/90 sm:text-3xl">{subheading}</p>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/70">{body}</p>
        </SectionReveal>

        <SectionReveal x={40} delay={0.1}>
          <div className="rounded-3xl border border-white/20 bg-black/30 p-5 backdrop-blur-sm sm:p-7">
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-4 border-b border-white/15 pb-3 text-xs font-semibold uppercase tracking-wide text-white/50 sm:grid-cols-[0.9fr_1fr_1fr]">
              <span />
              <span className="text-white">{columnLabels[0]}</span>
              <span className="text-white">{columnLabels[1]}</span>
            </div>
            <div className="divide-y divide-white/10">
              {rows.map((row) => (
                <div key={row.id} className="grid grid-cols-[1fr_1fr_1fr] gap-x-4 py-4 sm:grid-cols-[0.9fr_1fr_1fr]">
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/50">{row.label}</span>
                  <span className="text-[13px] leading-snug text-white/85 sm:text-sm">{row.businessClass}</span>
                  <span className="text-[13px] leading-snug text-white/85 sm:text-sm">{row.firstClass}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
