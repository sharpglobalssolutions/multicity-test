import { BusinessClassSection } from "@/components/BusinessClassSection";
import { DestinationCarousel } from "@/components/DestinationCarousel";
import { ExpertsSection } from "@/components/ExpertsSection";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PartnerStrip } from "@/components/PartnerStrip";
import { PersonalizedJourney } from "@/components/PersonalizedJourney";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { SocialSection } from "@/components/SocialSection";
import { Statistics } from "@/components/Statistics";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { TravelInsights } from "@/components/TravelInsights";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <PartnerStrip />
        <DestinationCarousel />
        <BusinessClassSection />
        <PersonalizedJourney />
        <Statistics />
        <ServicesCarousel />
        <ExpertsSection />
        <TestimonialCarousel />
        <FAQ />
        <TravelInsights />
        <FinalCTA />
        <SocialSection />
      </main>
      <Footer />
    </>
  );
}
