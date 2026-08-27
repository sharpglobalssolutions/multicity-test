import { PARTNER_AIRLINES } from "@/data/content";

export interface PartnerStripProps {
  airlines?: string[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale (no props = identical to before this became
 * DB-drivable). */
export function PartnerStrip({ airlines = [...PARTNER_AIRLINES] }: PartnerStripProps = {}) {
  // Duplicated once so the CSS marquee can loop seamlessly at -50%.
  const marqueeItems = [...airlines, ...airlines];

  return (
    <section aria-label="Trusted airline partners" className="border-b border-navy-deep/5 bg-[#f2f2f2] py-8">
      <div className="content-container">
        <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-14 group-hover:[animation-play-state:paused]">
            {marqueeItems.map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="whitespace-nowrap text-lg font-semibold tracking-wide text-text-gray/50"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
