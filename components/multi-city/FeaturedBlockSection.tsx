import { ImageTextBlock } from "@/components/business-class/ImageTextBlock";

export interface FeaturedBlockSectionProps {
  headingLines: string[];
  body: string;
  images: { src: string; alt: string }[];
  twoColumnItems?: string[][];
  buttonLabel?: string;
  buttonHref?: string;
  imagePosition?: "left" | "right";
}

/** Thin section/container wrapper around the Business Class page's shared
 * `ImageTextBlock` primitive — reused here as its own top-level page
 * section (rather than nested inside a combining component like
 * `BusinessClassOptions` does) since this page's featured blocks and
 * planning-CTA block each stand alone with their own vertical rhythm, not
 * grouped under one shared heading. */
export function FeaturedBlockSection({
  headingLines,
  body,
  images,
  twoColumnItems,
  buttonLabel,
  buttonHref,
  imagePosition = "left",
}: FeaturedBlockSectionProps) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <ImageTextBlock
          eyebrowLines={headingLines}
          body={body}
          images={images}
          twoColumnItems={twoColumnItems}
          buttonLabel={buttonLabel}
          buttonHref={buttonHref}
          imagePosition={imagePosition}
        />
      </div>
    </section>
  );
}
