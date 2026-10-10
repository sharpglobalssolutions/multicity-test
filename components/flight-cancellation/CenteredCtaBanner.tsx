import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";

export interface CenteredCtaBannerProps {
  heading?: string;
  subheading?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

/** A plain, solid-black centered CTA banner — same shape as
 * `FirstClassCenteredCta`, but without a modal trigger (this page has no
 * quote-form popup), so its own component rather than threading an
 * optional modal through that one. All props optional, falling back to
 * the current hardcoded default — see `Hero.tsx` for the rationale. */
export function CenteredCtaBanner({
  heading = "Still Deciding What to Do?",
  subheading = "Tell us what happened, and our travel specialists can help you review relevant flight cancellation, flight change, rebooking, refund and travel-credit options based on your booking.",
  buttonLabel = "Speak With a Specialist",
  buttonHref = "#connect",
}: CenteredCtaBannerProps = {}) {
  return (
    <section className="bg-black py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-white sm:text-4xl lg:text-[30px] font-semibold">{heading}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70 sm:text-base">{subheading}</p>
          <div className="mt-8 inline-block">
            <Button href={buttonHref} variant="gold">
              {buttonLabel}
            </Button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
