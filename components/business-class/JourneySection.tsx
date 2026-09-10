import { ImageTextBlock } from "@/components/business-class/ImageTextBlock";
import { JOURNEY_BLOCK } from "@/data/business-class-content";

export function JourneySection() {
  return (
    <section className="bg-gray-light py-16 sm:py-20">
      <div className="content-container">
        <ImageTextBlock
          eyebrowLines={JOURNEY_BLOCK.headingLines}
          body={JOURNEY_BLOCK.body}
          image={JOURNEY_BLOCK.image}
          benefits={JOURNEY_BLOCK.benefits}
          buttonLabel={JOURNEY_BLOCK.buttonLabel}
          buttonHref={JOURNEY_BLOCK.buttonHref}
          imagePosition="left"
        />
      </div>
    </section>
  );
}
