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
import { BUSINESS_CLASS_FAQS, BUSINESS_CLASS_STATS } from "@/data/business-class-content";
import { BUSINESS_CLASS_IMAGES } from "@/data/content";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Statistics } from "@/components/Statistics";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";

export const metadata: Metadata = {
  title: "Business Class Flights — MultiCityExperts",
  description:
    "Premium Business Class flights, one-way and multi-city itineraries planned by specialists — evaluating routing, cabins and airlines for the journey that fits you.",
};

export default function BusinessClassPage() {
  return (
    <>
      <Header />
      <main id="top">
        <BusinessClassHero />
        <QuickConsultSection />
        <Statistics stats={BUSINESS_CLASS_STATS} />
        <BusinessClassOptions />
        <FareComplexity />
        <BeyondPrice />
        <HowItWorks />
        <JourneySection />
        <BusinessClassServices />
        <BusinessClassExpertise />
        <FinalCTA
          heading="Your Journey Deserves Better Options."
          body="Speak with a Business Class specialist and explore the routes, airlines and fares that fit the way you travel."
          buttonLabel="Explore Business Class Options"
          buttonHref="#connect"
          backgroundImage={BUSINESS_CLASS_IMAGES[3]!.src}
        />
        <TestimonialCarousel heading="Client Experiences" subheading="Trusted by Discerning Travelers" />
        <FAQ eyebrow="Common Questions" heading="Everything You Need to Know" faqs={BUSINESS_CLASS_FAQS} />
      </main>
      <Footer />
    </>
  );
}
