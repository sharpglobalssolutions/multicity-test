import type { Metadata } from "next";
import { BrandPhilosophySection } from "@/components/BrandPhilosophySection";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { WhyChooseBeyondFare } from "@/components/why-choose-us/WhyChooseBeyondFare";
import { WhyChooseExperience } from "@/components/why-choose-us/WhyChooseExperience";
import { WhyChooseExpertise } from "@/components/why-choose-us/WhyChooseExpertise";
import { WhyChooseValues } from "@/components/why-choose-us/WhyChooseValues";
import {
  CONSULTATION_LINK_HTML,
  CONSULTATION_STEPS,
  CONSULTATION_SUBHEADING,
  ONE_SIZE_BODY,
  OUR_COMMITMENT_BODY,
  WHY_EXPERIENCE_MATTERS_BODY,
} from "@/data/why-choose-us-content";

export const metadata: Metadata = {
  title: "Why Choose Us — MultiCityExperts",
  description:
    "See why travellers choose MultiCityExperts: tailored advice, 11+ years of international travel expertise, and a traveller-first approach to complex itineraries.",
};

export default function WhyChooseUsPage() {
  return (
    <>
      <Header />
      <main id="top">
        <WhyChooseValues />
        <BrandPhilosophySection
          heading="Travel Isn't One-Size-Fits-All"
          body={ONE_SIZE_BODY}
        />
        <WhyChooseBeyondFare />
        <WhyChooseExperience />
        <WhyChooseExpertise />
        <HowItWorksCarousel
          heading="A Simpler Way to Plan International Travel"
          subheading={CONSULTATION_SUBHEADING}
          paragraph={CONSULTATION_LINK_HTML}
          steps={CONSULTATION_STEPS}
          variant="gray"
        />
        <BrandPhilosophySection
          heading="Why Experience Matters"
          body={WHY_EXPERIENCE_MATTERS_BODY}
        />
        <BrandPhilosophySection
          heading="Our Commitment"
          body={OUR_COMMITMENT_BODY}
          background="gray"
        />
        <FinalCTA
          heading="Travel With Confidence"
          body="Speak with a specialist to get personalised advice built around your route, preferences, and travel requirements."
          buttonLabel="Speak With a Travel Specialist"
        />
      </main>
      <Footer />
    </>
  );
}
