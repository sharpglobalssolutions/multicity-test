import Image from "next/image";
import { Button } from "@/components/Button";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

const DEFAULT_HEADING_LINES = ["Flight Cancellation", "Assistance"];

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. A cinematic full-bleed photo with
 * left-aligned text and no quote card — close to `WorkAroundYouSection`'s
 * shape, but taller, with a secondary heading line and a button, so its
 * own small component rather than overloading that one with options two
 * different pages would need threaded through it. */
export interface CancellationHeroProps {
  headingLines?: string[];
  subheading?: string;
  paragraph?: string;
  buttonLabel?: string;
  buttonHref?: string;
  /** Both optional — unset on every existing caller. Added for the Missed
   * Flight Assistance page's hero, whose reference copy pairs a primary
   * and secondary CTA. */
  secondaryButtonLabel?: string;
  secondaryButtonHref?: string;
  /** Optional small trust line below the button(s) (e.g. "Emergency travel
   * assistance • International flight specialists • Post-booking
   * support") — added for the Missed Flight Assistance page. Every
   * existing caller omits it. */
  trustLine?: string;
  backgroundImage?: string;
}

export function CancellationHero({
  headingLines = DEFAULT_HEADING_LINES,
  subheading = "Know Your Options Before You Cancel",
  paragraph = "Travel plans can change without warning. A family emergency, business schedule change, visa delay or airline disruption can leave you unsure about what to do with your flight booking.",
  buttonLabel = "Speak With a Travel Specialist",
  buttonHref = "#connect",
  secondaryButtonLabel,
  secondaryButtonHref,
  trustLine,
  backgroundImage = unsplash("1573497491208-6b1acb260507"),
}: CancellationHeroProps = {}) {
  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden bg-navy-deep pb-16 pt-32 sm:min-h-[620px] lg:min-h-[650px] lg:pt-24">
      <Image
        src={backgroundImage}
        alt="A travel specialist smiling while consulting with a client"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/60 to-navy-deep/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />

      <div className="content-container relative z-10">
        <SectionReveal className="max-w-xl">
          <h1 className="text-2xl font-semibold leading-[1.08] text-white sm:text-5xl lg:text-[40px]">
            {headingLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h1>
          {subheading ? <p className="mt-4 text-xl text-white/90 sm:text-2xl">{subheading}</p> : null}
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/80 sm:text-lg">{paragraph}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href={buttonHref} variant="gold">
              {buttonLabel}
            </Button>
            {secondaryButtonLabel && secondaryButtonHref ? (
              <Button href={secondaryButtonHref} variant="secondary">
                {secondaryButtonLabel}
              </Button>
            ) : null}
          </div>
          {trustLine ? <p className="mt-6 text-sm text-white/70">{trustLine}</p> : null}
        </SectionReveal>
      </div>
    </section>
  );
}
