import { ImageTextBlock } from "@/components/business-class/ImageTextBlock";
import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

export interface RefundVsCreditBlock {
  headingLines: string[];
  body: string;
  images: { src: string; alt: string }[];
  twoColumnItems?: string[][];
}

const DEFAULT_REFUND: RefundVsCreditBlock = {
  headingLines: ["Flight Refund"],
  body: "A refund means eligible ticket value may be returned according to the applicable fare and airline rules. Before requesting one, consider:",
  images: [{ src: unsplash("1569629743817-70d8db6c323b"), alt: "A wide-body aircraft on final approach against a blue sky" }],
  twoColumnItems: [
    ["Whether the fare is refundable", "Cancellation penalties", "Original payment method"],
    ["Refund processing conditions", "Unused ticket value", "Whether the airline initiated the cancellation or schedule change"],
  ],
};

const DEFAULT_CREDIT: RefundVsCreditBlock = {
  headingLines: ["Travel Credit"],
  body: "Travel credit may allow eligible ticket value to be retained for future travel under the airline's conditions.",
  images: [{ src: unsplash("1500835556837-99ac94a94552"), alt: "View from an aircraft window over clouds lit by a golden sunset" }],
  twoColumnItems: [
    ["Credit expiration date", "Who can use the credit", "Airline restrictions"],
    ["Rebooking deadline", "Fare difference", "Route or destination restrictions"],
  ],
};

export interface RefundVsCreditSectionProps {
  heading?: string;
  subheading?: string;
  refund?: RefundVsCreditBlock;
  credit?: RefundVsCreditBlock;
}

/** Pairs two `ImageTextBlock` instances (the shared Business Class/First
 * Class "image + text" primitive) under one shared heading — same
 * composite pattern as `BusinessClassOptions`, not a literal reuse of it,
 * since this page's two blocks (Flight Refund / Travel Credit) aren't the
 * one-way/multi-city pairing that component is named for. All props
 * optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function RefundVsCreditSection({
  heading = "Flight Refund vs Travel Credit: What's the Difference?",
  subheading = "When cancelling a flight, one of the most important questions is what happens to the value of your ticket. A cash refund and travel credit are different, and eligibility depends on the airline, fare conditions and circumstances of your booking.",
  refund = DEFAULT_REFUND,
  credit = DEFAULT_CREDIT,
}: RefundVsCreditSectionProps = {}) {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <div className="mt-14 space-y-16">
          <ImageTextBlock
            eyebrowLines={refund.headingLines}
            body={refund.body}
            images={refund.images}
            twoColumnItems={refund.twoColumnItems}
            imagePosition="left"
          />
          <ImageTextBlock
            eyebrowLines={credit.headingLines}
            body={credit.body}
            images={credit.images}
            twoColumnItems={credit.twoColumnItems}
            imagePosition="right"
          />
        </div>
      </div>
    </section>
  );
}
