import { ImageTextBlock } from "@/components/business-class/ImageTextBlock";
import { SectionReveal } from "@/components/SectionReveal";
import { MULTI_CITY_BLOCK, ONE_WAY_BLOCK } from "@/data/business-class-content";

export function BusinessClassOptions() {
  return (
    <section className="bg-gray-light py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">One-Way &amp; Multi-City Business Class</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">Different Ways to Fly. More Flexibility.</p>
        </SectionReveal>

        <div className="mt-14 space-y-16">
          <ImageTextBlock
            eyebrowLines={ONE_WAY_BLOCK.eyebrowLines}
            body={ONE_WAY_BLOCK.body}
            image={ONE_WAY_BLOCK.image}
            buttonLabel={ONE_WAY_BLOCK.buttonLabel}
            buttonHref={ONE_WAY_BLOCK.buttonHref}
            imagePosition="left"
          />
          <ImageTextBlock
            eyebrowLines={MULTI_CITY_BLOCK.eyebrowLines}
            body={MULTI_CITY_BLOCK.body}
            image={MULTI_CITY_BLOCK.image}
            buttonLabel={MULTI_CITY_BLOCK.buttonLabel}
            buttonHref={MULTI_CITY_BLOCK.buttonHref}
            imagePosition="right"
          />
        </div>
      </div>
    </section>
  );
}
