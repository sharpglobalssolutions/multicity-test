import Image from "next/image";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { FINAL_CTA_IMAGE } from "@/data/content";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-24 sm:py-32">
      <Image src={FINAL_CTA_IMAGE.src} alt={FINAL_CTA_IMAGE.alt} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/80 to-navy-deep/40" />

      <div className="content-container relative z-10">
        <SectionReveal className="max-w-xl">
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[44px]">
            Ready To Plan Your Next Journey?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
            Let our travel experts help you find the right premium flight for your next international
            trip.
          </p>
          <div className="mt-8">
            <Button href="#connect" variant="primary">
              Get Started
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
