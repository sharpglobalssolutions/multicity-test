import Image from "next/image";
import { AnimatedText } from "@/components/AnimatedText";
import { Button } from "@/components/Button";
import { FlightSearch } from "@/components/FlightSearch";
import { SectionReveal } from "@/components/SectionReveal";
import { HERO_IMAGE } from "@/data/content";

export function Hero() {
  return (
    <section
      id="flights"
      className="relative flex min-h-[650px] items-center overflow-hidden bg-navy-deep pb-16 pt-32 sm:min-h-[700px] lg:min-h-[750px] lg:pt-24"
    >
      <Image src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />

      <div className="content-container relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <SectionReveal>
            <span className="eyebrow">Premium International Travel</span>
          </SectionReveal>

          <AnimatedText
            as="h1"
            text={["Fly Premium.", "Pay Smarter."]}
            mode="line"
            className="mt-4 text-4xl font-bold leading-[1.08] text-white sm:text-5xl lg:text-[56px]"
          />

          <SectionReveal delay={0.3}>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">
              Experience premium business class travel without paying unnecessary premium prices.
            </p>
          </SectionReveal>

          <SectionReveal delay={0.45}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="#destinations" variant="primary">
                Explore Flights
              </Button>
              <Button href="#connect" variant="secondary">
                Talk to an Expert
              </Button>
            </div>
          </SectionReveal>
        </div>

        <SectionReveal scale={0.95} delay={0.2} className="lg:justify-self-end lg:w-full">
          <FlightSearch />
        </SectionReveal>
      </div>
    </section>
  );
}
