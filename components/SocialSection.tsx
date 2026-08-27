import { SOCIAL_ICON_MAP } from "@/components/SocialIcons";
import { SectionReveal } from "@/components/SectionReveal";
import { PARTNER_AIRLINES, SOCIAL_LINKS } from "@/data/content";

export interface SocialSectionProps {
  heading?: string;
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. Social icons stay global (`SOCIAL_LINKS`),
 * not per-section content. */
export function SocialSection({ heading = "Let's Stay Connected" }: SocialSectionProps = {}) {
  return (
    <section id="connect" className="bg-white py-16 sm:py-20">
      <div className="content-container text-center">
        <SectionReveal>
          <h2 className="text-2xl font-bold text-text-dark sm:text-3xl">{heading}</h2>
          <div className="mt-6 flex items-center justify-center gap-4">
            {SOCIAL_LINKS.map(({ label, href, icon }) => {
              const Icon = SOCIAL_ICON_MAP[icon];
              return (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-deep/10 text-navy-deep transition-colors hover:border-emerald hover:text-emerald"
                >
                  <Icon width={18} height={18} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {PARTNER_AIRLINES.map((name) => (
            <span key={name} className="text-sm font-semibold tracking-wide text-text-gray/50">
              {name}
            </span>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}
