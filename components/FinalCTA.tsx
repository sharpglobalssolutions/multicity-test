import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";

// The header's existing "call an expert" action — see components/Header.tsx.
const CALL_EXPERT_HREF = "tel:1869-504-657";
const DEFAULT_BACKGROUND_IMAGE = "/images/cta-banner.jpg";

export interface FinalCTAProps {
  heading?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
  backgroundImage?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. `backgroundImage` moves from a Tailwind
 * arbitrary-value class to an inline style since the class approach can't
 * take a runtime value. */
export function FinalCTA({
  heading = "Ready To Plan Your Next Journey?",
  body = "Complex international itineraries, business class expertise, and human support for travelers who demand more.",
  buttonLabel = "Call an expert",
  buttonHref = CALL_EXPERT_HREF,
  backgroundImage = DEFAULT_BACKGROUND_IMAGE,
}: FinalCTAProps = {}) {
  return (
    <section
      className="relative flex min-h-[420px] items-center overflow-hidden bg-navy-deep bg-cover bg-fixed bg-no-repeat bg-[position:25%_20%] py-16 sm:min-h-[520px] sm:bg-[position:32%_25%] sm:py-20 lg:min-h-[620px] lg:bg-[position:center_30%] lg:py-0"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/15" />

      <div className="content-container relative z-10">
        <SectionReveal className="max-w-lg">
          <h2 className="text-3xl  leading-tight text-white sm:text-4xl lg:text-[30px]">{heading}</h2>
          <div
            className="mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg"
            dangerouslySetInnerHTML={{ __html: body }}
          />
          <div className="mt-8">
            <Button href={buttonHref} variant="secondary">
              {buttonLabel}
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
