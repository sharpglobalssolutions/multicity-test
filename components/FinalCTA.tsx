import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";

// The header's existing "call an expert" action — see components/Header.tsx.
const CALL_EXPERT_HREF = "tel:1869-504-657";

export function FinalCTA() {
  return (
    <section
      className="relative flex min-h-[420px] items-center overflow-hidden bg-navy-deep bg-[url('/images/cta-banner.jpg')] bg-cover bg-fixed bg-no-repeat bg-[position:25%_20%] py-16 sm:min-h-[520px] sm:bg-[position:32%_25%] sm:py-20 lg:min-h-[620px] lg:bg-[position:center_30%] lg:py-0"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/15" />

      <div className="content-container relative z-10">
        <SectionReveal className="max-w-lg">
          <h2 className="text-3xl  leading-tight text-white sm:text-4xl lg:text-[30px]">
            Ready To Plan Your Next Journey?
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
            Complex international itineraries, business class expertise, and human support for travelers who demand
            more.
          </p>
          <div className="mt-8">
            <Button href={CALL_EXPERT_HREF} variant="secondary">
              Call an expert
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
