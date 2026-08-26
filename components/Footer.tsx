import Image from "next/image";
import Link from "next/link";
import { GetInTouchForm } from "@/components/GetInTouchForm";
import { SOCIAL_ICON_MAP } from "@/components/SocialIcons";
import { NewsletterForm } from "@/components/NewsletterForm";
import { DARK_FOOTER_LINKS, SOCIAL_LINKS, TRUST_BADGES } from "@/data/content";
import { listTopAirlines } from "@/services/airline.service";
import { listTopCities, listTopCountries } from "@/services/destination.service";

const DARK_FOOTER_COLUMNS = [
  { title: "Services", links: DARK_FOOTER_LINKS.services },
  { title: "Insights", links: DARK_FOOTER_LINKS.insights },
  { title: "Company", links: DARK_FOOTER_LINKS.company },
  { title: "Legal", links: DARK_FOOTER_LINKS.legal },
];

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
          <h2 className="text-[28px] uppercase  text-text-dark">Let&apos;s Stay Connected</h2>
          <div className="mt-5 flex items-center justify-center gap-4">
            {SOCIAL_LINKS.map(({ label, href, icon }) => {
              const Icon = SOCIAL_ICON_MAP[icon];
              return (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-navy-deep/15 text-text-dark transition-colors hover:border-navy-deep hover:bg-navy-dark hover:text-white"
                >
                  <Icon width={20} height={20} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Payment / trust badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3  border-navy-deep/10 pt-8">
          {TRUST_BADGES.map((badge) => (
            <span key={badge} className="text-[18]  uppercase tracking-wide text-text-gray">
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
          <p className="mx-auto max-w-2xl text-[16px] uppercase tracking-wide text-text-dark">
            Subscribe to our newsletters and be the first to receive updates on our latest sales and exclusive
            offers unavailable online
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main dark footer */}
      <div className="mt-16 bg-navy-deep text-white">
        <div className="content-container py-16">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.4fr] lg:gap-16">
            <div>
              <h2 className="text-3xl font-semibold leading-tight sm:text-[26px]">
                Your perfect
                <br />
                journey starts with
                <br />
                a conversation.
              </h2>

              <Image
                src="/logo/logo-white.webp"
                alt="MultiCityExperts"
                width={200}
                height={50}
                className="mt-8 w-50"
              />

              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
                Specialists in complex international routing, premium cabins and multi-city journeys designed around
                you.
              </p>
            </div>

            <div>
              <div className="max-w-md">
                <GetInTouchForm />
              </div>

              <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
                {DARK_FOOTER_COLUMNS.map((column) => (
                  <div key={column.title}>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-white/50">{column.title}</h3>
                    <ul className="mt-4 space-y-3">
                      {column.links.map((link) => (
                        <li key={link.label}>
                          <Link href={link.href} className="text-sm text-white/80 transition-colors hover:text-white">
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/10">
          <div className="content-container flex flex-col items-center gap-3 py-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="text-xs leading-relaxed text-white/50">
              <p>Multicity Experts is a service operated by SkyAlliance LLC.</p>
              <p>© {year} MulticityExperts. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/50">
              <Link href="#" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
