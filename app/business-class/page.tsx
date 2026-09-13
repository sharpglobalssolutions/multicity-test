import type { Metadata } from "next";
import { BeyondPrice } from "@/components/business-class/BeyondPrice";
import { BusinessClassExpertise } from "@/components/business-class/BusinessClassExpertise";
import { BusinessClassHero } from "@/components/business-class/BusinessClassHero";
import { BusinessClassOptions } from "@/components/business-class/BusinessClassOptions";
import { BusinessClassServices } from "@/components/business-class/BusinessClassServices";
import { FareComplexity } from "@/components/business-class/FareComplexity";
import { HowItWorks } from "@/components/business-class/HowItWorks";
import { JourneySection } from "@/components/business-class/JourneySection";
import { QuickConsultSection } from "@/components/business-class/QuickConsultSection";
import { StatsBar } from "@/components/business-class/StatsBar";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import type { Faq } from "@/data/content";
import { unsplash } from "@/lib/images";
import { getBusinessClassPageSeoSafely, getBusinessClassSectionsSafely } from "@/services/business-class.service";

// Every section below now reads its content from the database (see
// services/business-class.service.ts) — revalidate periodically so edits
// made in the admin panel appear without a full redeploy.
export const revalidate = 300;

/** This page's own fallback for the reused `CTA`/`TESTIMONIALS`/`FAQ`
 * section types — those components' own built-in defaults are homepage
 * copy, so without this, a missing section here would silently show
 * homepage content instead of this page's copy. */
const DEFAULT_CTA = {
  heading: "Your Journey Deserves Better Options.",
  body: "Speak with a Business Class specialist and explore the routes, airlines and fares that fit the way you travel.",
  buttonLabel: "Explore Business Class Options",
  buttonHref: "#connect",
  backgroundImage: unsplash("1488085061387-422e29b40080"),
};

const DEFAULT_TESTIMONIALS_HEADING = {
  heading: "Client Experiences",
  subheading: "Trusted by Discerning Travelers",
};

const DEFAULT_FAQS: Faq[] = [
  {
    id: "fare-included",
    question: "What is included in a business-class fare?",
    answer:
      "It varies by airline and fare type — typically lie-flat or angled seating, checked baggage, lounge access, and priority boarding, alongside enhanced dining. We'll walk you through exactly what's included before you book.",
  },
  {
    id: "change-booking",
    question: "Can I change my business-class booking?",
    answer:
      "Often yes, depending on the fare rules attached to your ticket. Some fares allow free changes, others carry a fee — we check this upfront so there are no surprises later.",
  },
  {
    id: "multi-city",
    question: "Do you offer multi-city business-class routes?",
    answer:
      "Yes — multi-city Business Class is one of our specialties. We plan connected itineraries across multiple destinations rather than booking each leg in isolation.",
  },
  {
    id: "flexible-fares",
    question: "Can you help find flexible business-class fares?",
    answer:
      "Absolutely. If flexibility matters more than the lowest headline price, we'll prioritise fares that let you change dates or routing without heavy penalties.",
  },
  {
    id: "how-it-works",
    question: "How does your business-class booking service work?",
    answer:
      "Tell us your travel requirements, our specialists evaluate suitable routes and fares across airlines, and you choose the option that works best for you — with support throughout.",
  },
];
const DEFAULT_FAQ_SECTION = { eyebrow: "Common Questions", heading: "Everything You Need to Know", faqs: DEFAULT_FAQS };

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getBusinessClassPageSeoSafely();
  if (!seo) return {};
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function BusinessClassPage() {
  const sections = await getBusinessClassSectionsSafely();

  return (
    <>
      <Header />
      <main id="top">
        <BusinessClassHero {...sections.BC_HERO} />
        <QuickConsultSection {...sections.BC_QUICK_CONSULT} />
        <StatsBar {...sections.BC_STATS} />
        <BusinessClassOptions
          {...sections.BC_OPTIONS}
          oneWay={sections.BC_OPTIONS_ONE_WAY}
          multiCity={sections.BC_OPTIONS_MULTI_CITY}
        />
        <FareComplexity {...sections.BC_FARE_COMPLEXITY} />
        <BeyondPrice {...sections.BC_BEYOND_PRICE} />
        <HowItWorks {...sections.BC_HOW_IT_WORKS} />
        <JourneySection {...sections.BC_JOURNEY} />
        <BusinessClassServices {...sections.BC_SERVICES} />
        <BusinessClassExpertise {...sections.BC_EXPERTISE} />
        <FinalCTA {...(sections.CTA ?? DEFAULT_CTA)} />
        <TestimonialCarousel {...(sections.TESTIMONIALS ?? DEFAULT_TESTIMONIALS_HEADING)} />
        <FAQ {...(sections.FAQ ?? DEFAULT_FAQ_SECTION)} />
      </main>
      <Footer />
    </>
  );
}
