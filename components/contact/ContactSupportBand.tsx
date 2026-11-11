import { Clock, FileText, Globe, Phone } from "lucide-react";
import { SectionReveal } from "@/components/SectionReveal";
import { CONTACT_SUPPORT_ITEMS, type ContactSupportItem } from "@/data/contact-content";

const ICONS = [Phone, Clock, FileText, Globe];

export interface ContactSupportBandProps {
  heading?: string;
  items?: ContactSupportItem[];
}

/** A full-width dark band with a faint world-map texture behind a 4-item
 * icon grid — same map-background treatment as `BusinessClassExpertise`/
 * `ServicesCarousel` (`/images/map.webp` at low opacity), just on a black
 * section instead of white. Its own component since no existing section
 * combines "dark band" + "map texture" + "icon grid" together. All props
 * optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function ContactSupportBand({
  heading = "Speak With a Travel Specialist",
  items = CONTACT_SUPPORT_ITEMS,
}: ContactSupportBandProps = {}) {
  return (
    <section className="relative overflow-hidden bg-black py-14 sm:py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10"
        style={{
          backgroundImage: "url('/images/map.webp')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "min(1400px, 160%) auto",
          filter: "invert(1)",
        }}
      />

      <div className="content-container relative">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] leading-[32px] text-white">{heading}</h2>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length] ?? Phone;
            return (
              <SectionReveal key={item.id} delay={index * 0.05} className="text-center">
                <Icon
                  size={32}
                  strokeWidth={1.5}
                  className="mx-auto text-[#D9BE85]"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-[16px] font-medium text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-[13px] leading-[18px] text-white/60">
                  {item.description}
                </p>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
