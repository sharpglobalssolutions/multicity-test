"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { PersonalizedQuoteModal } from "@/components/first-class/PersonalizedQuoteModal";

export interface FirstClassCenteredCtaProps {
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
  /** Kept for CMS-editing symmetry with every other section's button, but
   * unused here — this button's whole purpose is to open the personalised
   * quote form (`PersonalizedQuoteModal`) in place, not navigate away. */
  buttonHref?: string;
}

/** A plain, solid-black centered CTA banner — no background photo, unlike
 * `FinalCTA`/the page's other dark sections, which is exactly why it isn't
 * a reuse of either: this is a quieter, text-only closing moment partway
 * through the page, not a cinematic full-bleed one. All props optional,
 * falling back to the current hardcoded default — see `Hero.tsx` for the
 * rationale. */
export function FirstClassCenteredCta({
  heading = "Let's Plan Your First Class Journey",
  subheading = "Tell us what you're looking for, and our premium travel specialists can help you compare suitable First Class flights, airlines, routes, aircraft, cabin experiences and fare options.",
  buttonLabel = "Request My Personalised Quote",
}: FirstClassCenteredCtaProps = {}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-black py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-white sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70 sm:text-base">{subheading}</p>
          <div className="mt-8 inline-block">
            <Button type="button" variant="gold" onClick={() => setOpen(true)}>
              {buttonLabel}
            </Button>
          </div>
        </SectionReveal>
      </div>

      <PersonalizedQuoteModal open={open} onOpenChange={setOpen} />
    </section>
  );
}
