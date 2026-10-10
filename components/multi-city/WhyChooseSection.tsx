"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { SectionReveal } from "@/components/SectionReveal";

export interface WhyChooseFeature {
  id: string;
  title: string;
  description: string;
}

const DEFAULT_FEATURES: WhyChooseFeature[] = [
  {
    id: "years-experience",
    title: "11+ Years of Experience",
    description: "Over a decade planning complex international itineraries for travelers who need more than a single flight search.",
  },
  {
    id: "multi-city-expertise",
    title: "Multi-City Expertise",
    description: "Multi-city and open-jaw routing is one of our specialties, not an afterthought bolted onto a standard booking flow.",
  },
  {
    id: "north-atlantic-knowledge",
    title: "North Atlantic Route Knowledge",
    description: "Deep familiarity with the airlines, connections and fare rules that shape journeys between North America and Europe.",
  },
  {
    id: "human-support",
    title: "Real Human Support",
    description: "A travel specialist you can actually talk to, before and after you book — not just an automated search result.",
  },
  {
    id: "flexible-planning",
    title: "Flexible Planning",
    description: "We start with your priorities — destinations, dates and cabin preference — not a rigid, predefined package.",
  },
];

export interface WhyChooseSectionProps {
  heading?: string;
  features?: WhyChooseFeature[];
  /** Defaults to "light" (every existing caller's current white-background
   * look). The First Class page's own instance of this section sits on a
   * solid black background instead — see that page's `FC_WHY_CHOOSE`. */
  variant?: "light" | "dark";
  /** Defaults to "plain" (every existing caller's current borderless text
   * slide). The Flight Cancellation page's "Before You Cancel" instance
   * passes "bordered" instead, to match that page's reference design's
   * rounded, bordered pill cards. */
  cardStyle?: "plain" | "bordered";
  /** Defaults to "carousel" (every existing caller's current Swiper
   * behavior). The Flight Cancellation page's "Before You Cancel" instance
   * passes "grid" instead — it only ever has 3 features, which already fit
   * in the desktop 3-column layout, so a draggable carousel with
   * navigation arrows had nothing to actually scroll to and just read as
   * broken/pointless. "grid" renders the same bordered cards in a plain
   * CSS grid, no Swiper, no arrows. */
  layout?: "carousel" | "grid";
}

function WhyChooseCard({ feature, isDark, isBordered }: { feature: WhyChooseFeature; isDark: boolean; isBordered: boolean }) {
  return (
    <div
      className={
        isBordered
          ? `flex h-full flex-col items-center justify-center rounded-[32px] border px-8 py-10 text-center ${
              isDark ? "border-white/25" : "border-navy-deep/15"
            }`
          : "h-full text-center sm:text-left"
      }
    >
      <h3 className={`text-lg ${isDark ? "text-white" : "text-navy-deep"}`}>{feature.title}</h3>
      <p className={`mt-3 text-[15px] leading-relaxed ${isDark ? "text-white/70" : "text-text-gray"}`}>
        {feature.description}
      </p>
    </div>
  );
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function WhyChooseSection({
  heading = "Why Travellers Choose MultiCity Experts",
  features = DEFAULT_FEATURES,
  variant = "light",
  cardStyle = "plain",
  layout = "carousel",
}: WhyChooseSectionProps = {}) {
  const isDark = variant === "dark";
  const isBordered = cardStyle === "bordered";

  return (
    <section className={isDark ? "bg-navy-deep py-10 sm:py-14" : "bg-white py-10 sm:py-14"}>
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className={`text-2xl sm:text-4xl lg:text-[30px] font-semibold ${isDark ? "text-white" : "text-text-dark"}`}>
            {heading}
          </h2>
        </SectionReveal>

        {layout === "grid" ? (
          <SectionReveal delay={0.1} className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <WhyChooseCard key={feature.id} feature={feature} isDark={isDark} isBordered={isBordered} />
            ))}
          </SectionReveal>
        ) : (
          <SectionReveal delay={0.1} className="relative mt-12 px-10 sm:px-12">
            <Swiper
              modules={[Navigation]}
              navigation={{ prevEl: ".why-choose-prev", nextEl: ".why-choose-next" }}
              spaceBetween={32}
              slidesPerView={1}
              breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            >
              {features.map((feature) => (
                <SwiperSlide key={feature.id} className="h-auto">
                  <WhyChooseCard feature={feature} isDark={isDark} isBordered={isBordered} />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              type="button"
              aria-label="Previous"
              className={`why-choose-prev absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border transition-colors hover:border-emerald hover:text-emerald ${
                isDark ? "border-white/20 text-white" : "border-navy-deep/10 text-navy-deep"
              }`}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next"
              className={`why-choose-next absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border transition-colors hover:border-emerald hover:text-emerald ${
                isDark ? "border-white/20 text-white" : "border-navy-deep/10 text-navy-deep"
              }`}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </SectionReveal>
        )}
      </div>
    </section>
  );
}
