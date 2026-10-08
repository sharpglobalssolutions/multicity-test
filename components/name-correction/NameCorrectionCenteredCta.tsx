"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { NameCorrectionRequestModal } from "@/components/name-correction/NameCorrectionRequestModal";

export interface NameCorrectionCenteredCtaProps {
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
  disclaimer?: string;
}

/** A plain, solid-black centered CTA banner whose button opens
 * `NameCorrectionRequestModal` — same shape as `DateChangeCenteredCta`,
 * but its own component since it's paired with this page's own modal
 * rather than reusing that one. All props optional, falling back to the
 * current hardcoded default — see `Hero.tsx` for the rationale. */
export function NameCorrectionCenteredCta({
  heading = "Request Flight Name Correction Assistance",
  subheading = "Not sure whether your ticket can be corrected, or what documentation you need? Tell us what happened and we'll help you understand the next steps based on your booking and the applicable airline rules.",
  buttonLabel = "Review My Name Correction Options",
  disclaimer,
}: NameCorrectionCenteredCtaProps = {}) {
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

      <NameCorrectionRequestModal
        open={open}
        onOpenChange={setOpen}
        heading="Request Flight Name Correction Assistance"
        subheading="Tell Us About Your Booking"
        buttonLabel={buttonLabel}
        disclaimer={disclaimer}
      />
    </section>
  );
}
