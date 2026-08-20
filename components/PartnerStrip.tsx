import { PARTNER_AIRLINES } from "@/data/content";

/** Duplicated once so the CSS marquee can loop seamlessly at -50%. */
const MARQUEE_ITEMS = [...PARTNER_AIRLINES, ...PARTNER_AIRLINES];

export function PartnerStrip() {
  return (
    <section aria-label="Trusted airline partners" className="border-b border-navy-deep/5 bg-[#f2f2f2] py-8">
      <div className="content-container">
        <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee gap-14 group-hover:[animation-play-state:paused]">
            {MARQUEE_ITEMS.map((name, index) => (
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
