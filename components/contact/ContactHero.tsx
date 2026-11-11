import { Mail, Phone } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { CONTACT_INTRO_BODY } from "@/data/contact-content";

export interface ContactHeroProps {
  heading?: string;
  body?: string;
  emailLabel?: string;
  emailValue?: string;
  phoneLabel?: string;
  phoneValue?: string;
  backgroundImage?: string;
}

/** `emailValue`/`phoneValue` are display text, not a raw `mailto:`/`tel:`
 * target — the href is always derived from the value itself (stripping a
 * `tel:`/`mailto:` prefix if the admin happens to include one) so there's
 * no separate href field to drift out of sync or be mistyped into
 * something unsafe. All props optional, falling back to the current
 * hardcoded default — see `Hero.tsx` for the rationale. */
export function ContactHero({
  heading = "Contacts",
  body = CONTACT_INTRO_BODY,
  emailLabel = "Email",
  emailValue = "Support@multicityexperts.com",
  phoneLabel = "Toll free (US/Canada)",
  phoneValue = "888-608-1038",
  backgroundImage = "/images/world-dots.svg",
}: ContactHeroProps = {}) {
  const items = [
    {
      id: "email",
      icon: Mail,
      label: emailLabel,
      value: emailValue,
      href: `mailto:${emailValue.replace(/^mailto:/i, "")}`,
    },
    {
      id: "phone",
      icon: Phone,
      label: phoneLabel,
      value: phoneValue,
      href: `tel:${phoneValue.replace(/^tel:/i, "")}`,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white pb-10 pt-32 sm:pb-14 sm:pt-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "min(1400px, 160%) auto",
        }}
      />

      <div className="content-container relative mx-auto max-w-3xl text-center">
        <SectionReveal>
          <h1 className="text-[35px] leading-[40px] font-semibold text-text-dark">
            {heading}
          </h1>
          <p
            className="mx-auto mt-6 text-[14px] leading-[22px] text-text-gray"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-14 gap-y-6">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="group flex items-center gap-3 text-left"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-navy-deep/15 text-navy-deep transition-colors group-hover:border-emerald group-hover:text-emerald">
                  <item.icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[13px] text-text-gray">
                    {item.label}
                  </span>
                  <span className="block text-[15px] font-medium text-text-dark transition-colors group-hover:text-emerald">
                    {item.value}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
