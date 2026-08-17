import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/SocialIcons";
import { SectionReveal } from "@/components/SectionReveal";
import { PARTNER_AIRLINES } from "@/data/content";

const SOCIALS = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { label: "YouTube", href: "#", Icon: YoutubeIcon },
];

export function SocialSection() {
  return (
    <section id="connect" className="bg-white py-16 sm:py-20">
      <div className="content-container text-center">
        <SectionReveal>
          <h2 className="text-2xl font-bold text-text-dark sm:text-3xl">Let&apos;s Stay Connected</h2>
          <div className="mt-6 flex items-center justify-center gap-4">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-navy-deep/10 text-navy-deep transition-colors hover:border-emerald hover:text-emerald"
              >
                <Icon width={18} height={18} aria-hidden="true" />
              </a>
            ))}
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
