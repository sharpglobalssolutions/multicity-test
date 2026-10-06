import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";

export interface InfoBannerProps {
  /** "cta" (default): a statement paired with a gold button, e.g. "Travel
   * credit is not the same as a cash refund." "warning": a plain statement
   * with a warning triangle icon and no button, e.g. the fare-rules notice
   * before the FAQ. */
  tone?: "cta" | "warning";
  heading?: string;
  body?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

const DEFAULT_CTA_HEADING = "Travel credit is not the same as a cash refund.";
const DEFAULT_CTA_BODY = "Whether you qualify for a refund, credit or another remedy depends on your ticket and the applicable airline rules.";
const DEFAULT_WARNING_HEADING = "Cancellation rules are based on the specific fare purchased — not simply the airline or cabin class.";
const DEFAULT_WARNING_BODY = "Two passengers travelling on the same airline can have very different cancellation and refund conditions.";

/** A flat black inset banner reused twice on the Flight Cancellation page —
 * once as a CTA strip (statement + gold button) and once as a plain
 * warning notice (icon + statement). Its own small component since
 * nothing else on the site renders this flat, boxed-banner shape — every
 * other dark CTA (`FinalCTA`, `FirstClassCenteredCta`) is a full section
 * with a cinematic photo or solid full-bleed background, not an inset box
 * within a white section. All props optional, falling back to the current
 * hardcoded default — see `Hero.tsx` for the rationale. */
export function InfoBanner({
  tone = "cta",
  heading = tone === "warning" ? DEFAULT_WARNING_HEADING : DEFAULT_CTA_HEADING,
  body = tone === "warning" ? DEFAULT_WARNING_BODY : DEFAULT_CTA_BODY,
  buttonLabel = "Understand My Refund Options",
  buttonHref = "#connect",
}: InfoBannerProps = {}) {
  const isWarning = tone === "warning";

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="flex flex-col gap-6 bg-black p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:p-8">
          <div className="flex items-start gap-4">
            {isWarning ? (
              <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <AlertTriangle size={18} aria-hidden="true" />
              </span>
            ) : null}
            <div>
              <p className="text-lg font-semibold leading-snug text-white sm:text-xl">{heading}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{body}</p>
            </div>
          </div>

          {!isWarning ? (
            <div className="shrink-0">
              <Button href={buttonHref} variant="gold">
                {buttonLabel}
              </Button>
            </div>
          ) : null}
        </SectionReveal>
      </div>
    </section>
  );
}
