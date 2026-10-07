import Image from "next/image";
import Link from "next/link";
import { SectionReveal } from "@/components/SectionReveal";
import { TRAVEL_ADVISOR_IMAGE } from "@/data/content";

const DEFAULT_PARAGRAPHS = [
  "Online flight searches can give you thousands of combinations in seconds. But more choice doesn't always mean a better choice. The real challenge is knowing which itinerary actually works for your journey. A travel specialist can help you look beyond the obvious option and consider the details that may otherwise be overlooked.",
];

export interface TravelAdvisorItem {
  label: string;
  description: string;
}

const DEFAULT_ITEMS: TravelAdvisorItem[] = [
  {
    label: "Explore Alternative Routes",
    description: "A different routing could offer a more convenient schedule, shorter connection or better overall journey.",
  },
  {
    label: "Consider Nearby Airports",
    description: "Depending on where you're travelling from or to, an alternative airport may open up additional routing and flight options.",
  },
  {
    label: "Choose the Right Cabin",
    description: "Compare Economy, Premium Economy, Business Class and First Class according to your priorities, rather than simply choosing based on price.",
  },
  {
    label: "Understand Fare Flexibility",
    description: "Different fares come with different conditions. Understanding your available flexibility before booking can help you make a more informed decision.",
  },
  {
    label: "Navigate Complex Itineraries",
    description: "Multi-city, open-jaw and multiple-destination journeys often require more careful planning than a standard return flight.",
  },
  {
    label: "Build Around Your Schedule",
    description: "Your preferred departure time, arrival time, connection preferences and other practical requirements all matter.",
  },
];

export interface TravelAdvisorSectionProps {
  heading?: string;
  paragraphs?: string[];
  /** Optional — a labelled list below `paragraphs` (e.g. "Explore
   * Alternative Routes: ..."), each rendered as a bold label with a
   * description underneath. Unset renders no list, same as before this
   * field existed. */
  items?: TravelAdvisorItem[];
  imageSrc?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function TravelAdvisorSection({
  heading = "Why Expert Travel Advice Can Make Your Journey Easier",
  paragraphs = DEFAULT_PARAGRAPHS,
  items = DEFAULT_ITEMS,
  imageSrc = TRAVEL_ADVISOR_IMAGE.src,
  buttonLabel = "Connect With Travel Specialist",
  buttonHref = "#connect",
}: TravelAdvisorSectionProps = {}) {
  return (
    // overflow-x-hidden: see BusinessClassSection — clips the SectionReveal
    // x-offset slide-in so it can never cause page-level horizontal scroll.
    <section className="overflow-x-hidden bg-white py-10 sm:py-14">
      <div className="content-container grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <SectionReveal x={-60}>
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
            <Image src={imageSrc} alt={TRAVEL_ADVISOR_IMAGE.alt} fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
          </div>
        </SectionReveal>

        <SectionReveal x={60} delay={0.1}>
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={`max-w-lg text-[16px] leading-relaxed text-text-gray ${index === 0 ? "mt-5" : "mt-4"}`}
            >
              {paragraph}
            </p>
          ))}

          {items.length > 0 ? (
            <ul className="mt-6 max-w-lg space-y-4">
              {items.map((item) => (
                <li key={item.label}>
                  <p className="text-[16px] font-semibold text-text-dark">{item.label}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-text-gray">{item.description}</p>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8">
            <Link
              href={buttonHref}
              className="inline-flex items-center rounded-full bg-navy-deep px-7 py-3.5 text-[16px] font-semibold text-white transition-colors hover:bg-navy-dark"
            >
              {buttonLabel}
            </Link>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
