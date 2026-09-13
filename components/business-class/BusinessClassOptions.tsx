import { ImageTextBlock } from "@/components/business-class/ImageTextBlock";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

export interface BusinessClassOptionsBlock {
  eyebrowLines: string[];
  body: string;
  images: { src: string; alt: string }[];
  buttonLabel: string;
  buttonHref: string;
}

const DEFAULT_ONE_WAY: BusinessClassOptionsBlock = {
  eyebrowLines: ["ONE-WAY", "BUSINESS CLASS"],
  body: "Not every trip needs a return date. Whether you're relocating, extending a journey, or simply booking each leg on its own terms, one-way Business Class gives you the flexibility to structure travel exactly the way you need it — without paying for a round trip you won't use.",
  buttonLabel: "Explore One-Way",
  buttonHref: "#connect",
  images: [
    { src: unsplash("1569629743817-70d8db6c323b"), alt: "A wide-body aircraft on final approach against a blue sky" },
    {
      src: unsplash("1488085061387-422e29b40080"),
      alt: "An aircraft window view of a city skyline during descent at sunset",
    },
  ],
};

const DEFAULT_MULTI_CITY: BusinessClassOptionsBlock = {
  eyebrowLines: ["MULTI-CITY", "BUSINESS CLASS"],
  body: "Visiting more than one destination on the same trip shouldn't mean booking separate, disconnected fares. Our specialists build multi-city Business Class itineraries around your full route — coordinating connections, cabins and timing so every leg works together.",
  buttonLabel: "Explore Multi-City",
  buttonHref: "#connect",
  images: [
    {
      src: unsplash("1500835556837-99ac94a94552"),
      alt: "View from an aircraft window over clouds lit by a golden sunset",
    },
    { src: unsplash("1569154941061-e231b4725ef1"), alt: "A passenger's premium business class seat and workspace in flight" },
  ],
};

export interface BusinessClassOptionsProps {
  heading?: string;
  subheading?: string;
  oneWay?: BusinessClassOptionsBlock;
  multiCity?: BusinessClassOptionsBlock;
}

/** Its own section — styled similarly to the homepage's image+text
 * sections (same fonts, image treatment, carousel behavior) via the
 * shared `ImageTextBlock` primitive, but not a literal reuse of the
 * homepage's own `BusinessClassSection`/`PersonalizedJourney` component
 * instances. All props optional, falling back to the current hardcoded
 * default — see `Hero.tsx` for the rationale. */
export function BusinessClassOptions({
  heading = "One-Way & Multi-City Business Class",
  subheading = "Different Ways to Fly. More Flexibility.",
  oneWay = DEFAULT_ONE_WAY,
  multiCity = DEFAULT_MULTI_CITY,
}: BusinessClassOptionsProps = {}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <div className="mt-14 space-y-16">
          <ImageTextBlock
            eyebrowLines={oneWay.eyebrowLines}
            body={oneWay.body}
            images={oneWay.images}
            buttonLabel={oneWay.buttonLabel}
            buttonHref={oneWay.buttonHref}
            imagePosition="left"
          />
          <ImageTextBlock
            eyebrowLines={multiCity.eyebrowLines}
            body={multiCity.body}
            images={multiCity.images}
            buttonLabel={multiCity.buttonLabel}
            buttonHref={multiCity.buttonHref}
            imagePosition="right"
          />
        </div>
      </div>
    </section>
  );
}
