import Link from "next/link";
import { FacebookIcon, InstagramIcon, LinkedinIcon, YoutubeIcon } from "@/components/SocialIcons";
import { FOOTER_LINKS } from "@/data/content";

const FOOTER_SOCIALS = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "LinkedIn", href: "#", Icon: LinkedinIcon },
  { label: "YouTube", href: "#", Icon: YoutubeIcon },
];

const COLUMNS = [
  { title: "Services", links: FOOTER_LINKS.services },
  { title: "Company", links: FOOTER_LINKS.company },
  { title: "Support", links: FOOTER_LINKS.support },
  { title: "Destinations", links: FOOTER_LINKS.destinations },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep pt-16 text-white/70">
      <div className="content-container">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="#top" className="font-heading text-xl font-bold text-white">
              MultiCity<span className="text-emerald">Experts</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Premium business and first class fares for complex international itineraries, backed by
              real travel advisors.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-white">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-emerald-bright">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-white/50">© {year} MultiCityExperts. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <Link href="#" className="hover:text-emerald-bright">
              Privacy
            </Link>
            <Link href="#" className="hover:text-emerald-bright">
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {FOOTER_SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-emerald hover:text-emerald"
              >
                <Icon width={16} height={16} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
