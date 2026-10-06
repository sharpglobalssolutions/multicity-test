import { ImageTextBlock } from "@/components/business-class/ImageTextBlock";

export interface FeaturedBlockSectionProps {
  headingLines: string[];
  body: string;
  images: { src: string; alt: string }[];
  benefits?: string[];
  twoColumnItems?: string[][];
  titledItems?: { title: string; description: string }[];
  buttonLabel?: string;
  buttonHref?: string;
  buttonVariant?: "navy" | "gold";
  imagePosition?: "left" | "right";
  /** Defaults to "white" (every existing caller's current background). The
   * Flight Change page's "When Can MultiCity Experts Help?" instance
   * passes "gray" instead, to match that page's reference design. */
  background?: "white" | "gray";
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
  benefits,
  twoColumnItems,
  titledItems,
  buttonLabel,
  buttonHref,
  buttonVariant,
  imagePosition = "left",
  background = "white",
}: FeaturedBlockSectionProps) {
  return (
    <section className={background === "gray" ? "bg-gray-light py-10 sm:py-14" : "bg-white py-10 sm:py-14"}>
      <div className="content-container">
        <ImageTextBlock
          eyebrowLines={headingLines}
          body={body}
          images={images}
          benefits={benefits}
          twoColumnItems={twoColumnItems}
          titledItems={titledItems}
          buttonLabel={buttonLabel}
          buttonHref={buttonHref}
          buttonVariant={buttonVariant}
          imagePosition={imagePosition}
        />
      </div>
    </section>
  );
}
