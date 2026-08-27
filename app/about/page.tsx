import type { Metadata } from "next";
import { AboutApproach } from "@/components/about/AboutApproach";
import { AboutCoreValues } from "@/components/about/AboutCoreValues";
import { AboutHowWeHelp } from "@/components/about/AboutHowWeHelp";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutWhoWeHelp } from "@/components/about/AboutWhoWeHelp";
import { AboutWhyChooseUs } from "@/components/about/AboutWhyChooseUs";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { FinalCTA } from "@/components/FinalCTA";
import { Header } from "@/components/Header";
import { ABOUT_FAQS } from "@/data/about-content";

export const metadata: Metadata = {
  title: "About Us — MultiCityExperts",
  description:
    "Learn how MultiCityExperts helps business travellers, families and couples plan complex international itineraries with a dedicated travel specialist.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="top">
        <AboutStory />
        <AboutApproach />
        <AboutWhoWeHelp />
        <AboutHowWeHelp />
        <AboutCoreValues />
        <AboutWhyChooseUs />
        <FAQ eyebrow="Common Questions" heading="Everything You Need to Know" faqs={ABOUT_FAQS} />
        <FinalCTA
          heading="Travel Advice Built Around Your Journey"
          body="Every journey is different. Speak with a specialist to get personalised advice and assistance based on your route, preferences, and travel requirements."
          buttonLabel="Connect With a Travel Specialist"
          buttonHref="#connect"
        />
      </main>
      <Footer />
    </>
  );
}
