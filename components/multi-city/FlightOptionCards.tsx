import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

export interface FlightOptionCard {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
}

const DEFAULT_CARDS: FlightOptionCard[] = [
  {
    id: "one-way",
    title: "One-Way International Flights",
    description:
      "Flying to Europe for relocation, an extended stay, study or a longer international journey? Explore one-way flight options around your plans.",
    image: unsplash("1569629743817-70d8db6c323b"),
    alt: "A traveler with a backpack watching an aircraft on the tarmac",
  },
  {
    id: "multi-city",
    title: "Multi-City Flights",
    description:
      "Visiting several European destinations? Build your itinerary around where you want to go rather than a standard return route.",
    image: unsplash("1524661135-423995f22d0b"),
    alt: "A pinned world map showing routes across countries and continents",
  },
];

export interface FlightOptionCardsProps {
  heading?: string;
  subheading?: string;
  cards?: FlightOptionCard[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function FlightOptionCards({
  heading = "One-Way or Multi-City?",
  subheading = "Plan Your Europe Trip Your Way",
  cards = DEFAULT_CARDS,
}: FlightOptionCardsProps = {}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl leading-tight text-text-dark sm:text-4xl lg:text-[30px]">
            <span className="block">{heading}</span>
            <span className="block">{subheading}</span>
          </h2>
        </SectionReveal>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
          {cards.map((card, index) => (
            <SectionReveal key={card.id} delay={index * 0.1}>
              <article className="overflow-hidden rounded-card shadow-card">
                <div className="relative aspect-[16/11] w-full">
                  <Image src={card.image} alt={card.alt} fill sizes="(min-width: 640px) 45vw, 90vw" className="object-cover" />
                </div>
                <div className="bg-gray-light p-6">
                  <h3 className="text-xl text-text-dark">{card.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-text-gray">{card.description}</p>
                </div>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
