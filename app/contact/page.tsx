import type { Metadata } from "next";
import { ImageTextBlock } from "@/components/business-class/ImageTextBlock";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactSupportBand } from "@/components/contact/ContactSupportBand";
import { LightFaqSection } from "@/components/first-class/LightFaqSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { HowItWorksCarousel } from "@/components/multi-city/HowItWorksCarousel";
import { SectionReveal } from "@/components/SectionReveal";
import {
  ENQUIRY_STEPS,
  SPEAK_WITH_SPECIALIST_BODY,
  SPEAK_WITH_SPECIALIST_IMAGE,
  TRAVEL_SUPPORT_BODY,
  TRAVEL_SUPPORT_IMAGE,
  TRAVEL_SUPPORT_ITEMS,
  UNDERSTAND_JOURNEY_BODY,
  UNDERSTAND_JOURNEY_IMAGE,
  UNDERSTAND_JOURNEY_ITEMS,
} from "@/data/contact-content";
import { getContactPageSeoSafely, getContactSectionsSafely } from "@/services/contact.service";

// Every section below reads its content from the database (see
// services/contact.service.ts) — revalidate periodically so edits made in
// the admin panel appear without a full redeploy.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContactPageSeoSafely();
  if (!seo) {
    return {
      title: "Contact Us — MultiCityExperts",
      description:
        "Get in touch with MultiCityExperts for personalised international travel assistance — speak with a specialist by phone, email or our online enquiry form.",
    };
  }
  return {
    title: seo.seoTitle ?? undefined,
    description: seo.metaDescription ?? undefined,
  };
}

export default async function ContactPage() {
  const sections = await getContactSectionsSafely();
  const seo = await getContactPageSeoSafely();

  const speakSpecialist = sections.CT_SPEAK_SPECIALIST;
  const understandJourney = sections.CT_UNDERSTAND_JOURNEY;
  const travelSupport = sections.CT_TRAVEL_SUPPORT;

  return (
    <>
      <JsonLd data={seo?.schemaData} />
      <Header />
      <main id="top">
        <ContactHero {...sections.CT_HERO} />

        <section className="bg-white py-10 sm:py-14">
          <div className="content-container">
            <SectionReveal>
              <ImageTextBlock
                eyebrowLines={speakSpecialist?.headingLines ?? ["Speak With a Travel Specialist"]}
                body={speakSpecialist?.body ?? SPEAK_WITH_SPECIALIST_BODY}
                images={speakSpecialist?.images ?? [SPEAK_WITH_SPECIALIST_IMAGE]}
                imagePosition="left"
                buttonLabel={speakSpecialist?.buttonLabel ?? "Call an expert"}
                buttonHref={speakSpecialist?.buttonHref ?? "tel:1869-504-657"}
                buttonVariant="navy"
              />
            </SectionReveal>
          </div>
        </section>

        <section className="bg-gray-light py-10 sm:py-14">
          <div className="content-container">
            <SectionReveal>
              <ImageTextBlock
                eyebrowLines={understandJourney?.headingLines ?? ["Help Us Understand Your Journey"]}
                body={understandJourney?.body ?? UNDERSTAND_JOURNEY_BODY}
                images={understandJourney?.images ?? [UNDERSTAND_JOURNEY_IMAGE]}
                imagePosition="right"
                twoColumnItems={understandJourney?.twoColumnItems ?? UNDERSTAND_JOURNEY_ITEMS}
              />
            </SectionReveal>
          </div>
        </section>

        <HowItWorksCarousel
          heading={sections.CT_ENQUIRY_STEPS?.heading ?? "What Happens After Your Enquiry?"}
          subheading={sections.CT_ENQUIRY_STEPS?.subheading ?? ""}
          steps={sections.CT_ENQUIRY_STEPS?.steps ?? ENQUIRY_STEPS}
          variant="gray"
        />

        <section className="bg-white py-10 sm:py-14">
          <div className="content-container">
            <SectionReveal>
              <ImageTextBlock
                eyebrowLines={travelSupport?.headingLines ?? ["International Travel Support for Every Journey"]}
                body={travelSupport?.body ?? TRAVEL_SUPPORT_BODY}
                images={travelSupport?.images ?? [TRAVEL_SUPPORT_IMAGE]}
                imagePosition="right"
                twoColumnItems={travelSupport?.twoColumnItems ?? TRAVEL_SUPPORT_ITEMS}
              />
            </SectionReveal>
          </div>
        </section>

        <LightFaqSection
          heading={sections.CT_FAQ?.heading ?? "Frequently Asked Questions"}
          faqs={sections.CT_FAQ?.faqs}
        />

        <ContactSupportBand heading={sections.CT_SUPPORT_BAND?.heading} items={sections.CT_SUPPORT_BAND?.items} />
      </main>
      <Footer />
    </>
  );
}
