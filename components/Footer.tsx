import Link from "next/link";
import { SOCIAL_ICON_MAP } from "@/components/SocialIcons";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SOCIAL_LINKS, TRUST_BADGES } from "@/data/content";
import { listTopAirlines } from "@/services/airline.service";
import { listTopCities, listTopCountries } from "@/services/destination.service";

interface LinkColumn {
  title: string;
  links: { label: string; url: string; slug: string }[];
}

async function getLinkColumns(): Promise<LinkColumn[]> {
  const [countries, cities, airlines] = await Promise.all([
    listTopCountries(10),
    listTopCities(10),
    listTopAirlines(10),
  ]);

  return [
    { title: "Top Countries", links: countries },
    { title: "Top Cities", links: cities },
    { title: "Top Airlines", links: airlines },
  ];
}

export async function Footer() {
  const year = new Date().getFullYear();
  const columns = await getLinkColumns();

  return (
    <footer className="bg-white pt-16 text-text-dark">
      <div className="content-container">
        {/* Let's Stay Connected */}
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-dark">Let&apos;s Stay Connected</h2>
          <div className="mt-5 flex items-center justify-center gap-4">
            {SOCIAL_LINKS.map(({ label, href, icon }) => {
              const Icon = SOCIAL_ICON_MAP[icon];
              return (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-deep/15 text-text-dark transition-colors hover:border-navy-deep hover:text-navy-deep"
                >
                  <Icon width={17} height={17} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Payment / trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-navy-deep/10 pt-8">
          {TRUST_BADGES.map((badge) => (
            <span key={badge} className="text-xs font-semibold uppercase tracking-wide text-text-gray/60">
              {badge}
            </span>
          ))}
        </div>

        {/* Top Countries / Top Cities / Top Airlines */}
        <div className="mt-12 grid grid-cols-1 gap-10 border-t border-navy-deep/10 pt-12 sm:grid-cols-3 sm:gap-8">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-text-dark">{column.title}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.slug}>
                    <Link
                      href={link.url}
                      className="text-sm text-text-gray transition-colors hover:text-navy-deep hover:underline hover:underline-offset-4"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 border-t border-navy-deep/10 pt-12 text-center">
          <p className="mx-auto max-w-2xl text-sm font-semibold uppercase tracking-wide text-text-dark">
            Subscribe to our newsletters and be the first to receive updates on our latest sales and exclusive
            offers unavailable online
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>

        {/* Legal bar */}
        <div className="mt-14 flex flex-col items-center gap-4 border-t border-navy-deep/10 py-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-text-gray">© {year} MultiCityExperts. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-text-gray">
            <Link href="#" className="hover:text-navy-deep">
              Privacy
            </Link>
            <Link href="#" className="hover:text-navy-deep">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
