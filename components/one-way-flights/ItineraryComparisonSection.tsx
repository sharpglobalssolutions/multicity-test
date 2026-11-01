import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";

export interface ItineraryComparisonCard {
  id: string;
  title: string;
  example: string[];
  points: string[];
}

const DEFAULT_CARDS: ItineraryComparisonCard[] = [
  {
    id: "one-way",
    title: "One-Way",
    example: ["Toronto", "Paris"],
    points: [
      "You don't need a return flight yet",
      "You're relocating",
      "Your return destination isn't known",
      "You're planning an extended stay",
    ],
  },
  {
    id: "open-jaw",
    title: "Open-Jaw",
    example: ["Toronto", "London", "Amsterdam", "Toronto"],
    points: [
      "You want to travel between your arrival and departure cities",
      "You want to avoid unnecessary backtracking",
      "Your journey naturally finishes somewhere different",
    ],
  },
  {
    id: "multi-city",
    title: "Multi-City",
    example: ["New York", "London", "Rome", "Paris", "New York"],
    points: [
      "Several flight sectors need to be included in the same overall itinerary",
    ],
  },
];

export interface ItineraryComparisonSectionProps {
  heading?: string;
  subheading?: string;
  cards?: ItineraryComparisonCard[];
}

/** A 3-card "which itinerary structure fits you" comparison — its own
 * component since nothing else on the site pairs a route-chip example with
 * a "may suit you if" bullet list across three cards. All props optional,
 * falling back to the current hardcoded default — see `Hero.tsx` for the
 * rationale. */
export function ItineraryComparisonSection({
  heading = "One-Way vs Open-Jaw vs Multi-City",
  subheading = "These itinerary structures are related, but they serve different travel needs.",
  cards = DEFAULT_CARDS,
}: ItineraryComparisonSectionProps = {}) {
  return (
    <section className="bg-gray-light py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-4xl text-center">
          <h2 className="text-[28px] leading-[32px] text-text-dark">
            {heading}
          </h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">
            {subheading}
          </p>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {cards.map((card, index) => (
            <SectionReveal key={card.id} delay={index * 0.08}>
              <div className="flex h-full flex-col rounded-card bg-white p-7 shadow-card">
                <h3 className="text-xl text-navy-deep">{card.title}</h3>

                <div className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                  {card.example.map((city, cityIndex) => (
                    <span key={`${card.id}-${cityIndex}`} className="flex items-center gap-1.5">
                      <span className="rounded-full bg-emerald/10 px-3 py-1 text-[13px] font-medium text-emerald">
                        {city}
                      </span>
                      {cityIndex < card.example.length - 1 ? (
                        <ArrowRight
                          size={13}
                          className="shrink-0 text-navy-deep/30"
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                  ))}
                </div>

                <p className="mt-5 text-[13px] font-semibold uppercase tracking-wide text-navy-deep/60">
                  May suit you if
                </p>
                <ul className="mt-3 space-y-2.5">
                  {card.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-[13px] leading-[18px] text-text-gray"
                    >
                      <span
                        className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald"
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
