import { SectionReveal } from "@/components/SectionReveal";

export interface RouteFlowStep {
  label: string;
  value: string;
}

export interface RouteFlowPanel {
  id: string;
  title: string;
  steps: RouteFlowStep[];
  caption?: string;
}

const DEFAULT_PANELS: RouteFlowPanel[] = [
  {
    id: "traditional",
    title: "Traditional Round Trip",
    steps: [
      { label: "Fly", value: "New York → London" },
      { label: "Travel", value: "London → Paris → Rome" },
      { label: "Then", value: "Rome → London → New York" },
    ],
    caption: "You return to London primarily because that's where your international flight started.",
  },
  {
    id: "open-jaw",
    title: "Open-Jaw Alternative",
    steps: [
      { label: "Fly", value: "New York → London" },
      { label: "Travel", value: "London → Paris → Rome" },
      { label: "Then", value: "Rome → New York" },
    ],
    caption: "The international flights follow the direction of your journey.",
  },
];

export interface RouteFlowCompareSectionProps {
  heading?: string;
  subheading?: string;
  panels?: RouteFlowPanel[];
}

function RouteFlowPanelCard({ panel }: { panel: RouteFlowPanel }) {
  return (
    <div className="h-full rounded-card border border-navy-deep/10 bg-white p-7 sm:p-8">
      <h3 className="text-xl text-text-dark">{panel.title}</h3>
      <div className="mt-6 space-y-4">
        {panel.steps.map((step, index) => (
          <div key={`${panel.id}-${index}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex size-2 shrink-0 rounded-full bg-emerald" aria-hidden="true" />
              {index < panel.steps.length - 1 ? (
                <span className="mt-1 w-px flex-1 bg-navy-deep/10" aria-hidden="true" />
              ) : null}
            </div>
            <div className="pb-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-navy-deep/50">
                {step.label}
              </p>
              <p className="mt-1 text-[14px] font-medium text-text-dark">
                {step.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      {panel.caption ? (
        <p className="mt-2 text-[13px] leading-[18px] text-text-gray">
          {panel.caption}
        </p>
      ) : null}
    </div>
  );
}

/** A side-by-side "this routing vs that routing" comparison, each panel a
 * vertical flow of labelled route steps — its own component since nothing
 * else on the site visualizes a sequence of flight segments this way. All
 * props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function RouteFlowCompareSection({
  heading = "Fly Into One City. Return From Another.",
  subheading = "One of the simplest ways to rethink a European trip is to stop assuming your return flight must leave from the city where you arrived.",
  panels = DEFAULT_PANELS,
}: RouteFlowCompareSectionProps = {}) {
  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-4xl text-center">
          <h2 className="text-[28px] leading-[32px] text-text-dark">
            {heading}
          </h2>
          <p className="mt-3 text-base text-text-gray sm:text-lg">
            {subheading}
          </p>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {panels.map((panel, index) => (
            <SectionReveal key={panel.id} delay={index * 0.1}>
              <RouteFlowPanelCard panel={panel} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
