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
import { RoutesCarousel } from "@/components/RoutesCarousel";
import { ServicesCarousel } from "@/components/ServicesCarousel";
import { SocialSection } from "@/components/SocialSection";
import { Statistics } from "@/components/Statistics";
import { SupportSection } from "@/components/SupportSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { TravelAdvisorSection } from "@/components/TravelAdvisorSection";
import { TravelInsights } from "@/components/TravelInsights";

// The page is otherwise fully static, but TravelInsights reads live blog
// posts from the database — revalidate periodically so newly published
// posts appear without a full redeploy.
export const revalidate = 300;

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
        <TravelAdvisorSection />
        <ServicesCarousel />
        <SupportSection />
        <ExpertsSection />
        <TestimonialCarousel />
        <FAQ />
        <TravelInsights />
        <RoutesCarousel />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
