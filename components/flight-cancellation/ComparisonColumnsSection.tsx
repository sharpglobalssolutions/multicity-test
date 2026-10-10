import { SectionReveal } from "@/components/SectionReveal";

export interface ComparisonGroup {
  heading: string;
  /** Optional short intro line under the group heading. */
  intro?: string;
  /** Newline-separated — see `CnxComparisonSectionData` in
   * `types/page-sections.ts` for why a plain bullet column is stored as
   * one string rather than a real array. */
  columnA: string;
  columnB: string;
}

export interface ComparisonColumnsSectionProps {
  heading?: string;
  subheading?: string;
  groupOne?: ComparisonGroup;
  groupTwo?: ComparisonGroup;
}

const DEFAULT_GROUP_ONE: ComparisonGroup = {
  heading: "When Cancelling May Make Sense",
  intro: "Cancellation may be worth considering when:",
  columnA: "You no longer intend to travel\nYour trip has been postponed indefinitely\nYour fare permits cancellation or refund",
  columnB: "Refund eligibility\nCancellation fees\nFare conditions",
};

const DEFAULT_GROUP_TWO: ComparisonGroup = {
  heading: "When Changing or Rebooking May Make More Sense",
  intro: "Changing your flight may be worth considering when:",
  columnA: "You still intend to travel\nYour dates have changed\nYour destination remains the same",
  columnB: "Fare difference\nChange conditions\nAlternative flight availability",
};

function ComparisonGroupColumn({ group }: { group: ComparisonGroup }) {
  const columnA = group.columnA.split("\n").filter(Boolean);
  const columnB = group.columnB.split("\n").filter(Boolean);

  return (
    <div>
      <h3 className="text-xl text-text-dark sm:text-2xl">{group.heading}</h3>
      {group.intro ? <p className="mt-3 text-[15px] leading-relaxed text-text-gray">{group.intro}</p> : null}
      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2">
        <ul className="space-y-2.5">
          {columnA.map((item) => (
            <li key={item} className="text-[15px] text-text-dark">
              {item}
            </li>
          ))}
        </ul>
        <ul className="space-y-2.5">
          {columnB.map((item) => (
            <li key={item} className="text-[15px] text-text-dark">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** A "should you cancel, change or rebook" style comparison — two labelled
 * groups, each with its own two-column bullet list, divided by a vertical
 * rule on desktop. Its own component since nothing else on the site pairs
 * two independent two-column lists like this. All props optional, falling
 * back to the current hardcoded default — see `Hero.tsx` for the
 * rationale. */
export function ComparisonColumnsSection({
  heading = "Should You Cancel, Change or Rebook Your Flight?",
  subheading = "Cancelling and changing a flight are not always the same decision. The right path depends on why your plans changed, the fare you purchased and whether you still intend to travel.",
  groupOne = DEFAULT_GROUP_ONE,
  groupTwo = DEFAULT_GROUP_TWO,
}: ComparisonColumnsSectionProps = {}) {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px] font-semibold">{heading}</h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="mt-12 rounded-card bg-gray-light p-8 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:divide-x lg:divide-navy-deep/10">
            <div className="lg:pr-10">
              <ComparisonGroupColumn group={groupOne} />
            </div>
            <div className="lg:pl-10">
              <ComparisonGroupColumn group={groupTwo} />
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
