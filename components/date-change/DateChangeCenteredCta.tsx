"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { DateChangeRequestModal } from "@/components/date-change/DateChangeRequestModal";

export interface DateChangeCenteredCtaProps {
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
  disclaimer?: string;
}

/** A plain, solid-black centered CTA banner whose button opens
 * `DateChangeRequestModal` — same shape as `FirstClassCenteredCta`/
 * `CenteredCtaBanner`, but its own component since it's paired with this
 * page's own modal rather than reusing either of theirs. All props
 * optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function DateChangeCenteredCta({
  heading = "Request Flight Date Change Assistance",
  subheading = "Tell us what's changed — your airline, booking details and the date you'd prefer instead — and a travel specialist will help you review the available options.",
  buttonLabel = "Review My Date Change Options",
  disclaimer,
}: DateChangeCenteredCtaProps = {}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-black py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-white sm:text-4xl lg:text-[30px] font-semibold">{heading}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70 sm:text-base">{subheading}</p>
          <div className="mt-8 inline-block">
            <Button type="button" variant="gold" onClick={() => setOpen(true)}>
              {buttonLabel}
            </Button>
          </div>
        </SectionReveal>
      </div>

      <DateChangeRequestModal
        open={open}
        onOpenChange={setOpen}
        heading="Request Flight Date Change Assistance"
        subheading="Tell Us What Has Changed"
        buttonLabel={buttonLabel}
        disclaimer={disclaimer}
      />
    </section>
  );
}
