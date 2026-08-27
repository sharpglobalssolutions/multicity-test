import Image from "next/image";
import { SectionReveal } from "@/components/SectionReveal";
import { STORY_IMAGES, STORY_PARAGRAPHS } from "@/data/about-content";

export function AboutStory() {
  return (
    <section className="overflow-x-hidden bg-white py-16 sm:py-24">
      <div className="content-container grid grid-cols-1 gap-20 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        {/* Left: large portrait with a smaller, older portrait overlapping its bottom-left */}
        <SectionReveal x={-60} className="relative">
          <div className="relative aspect-[3/4] w-[82%] overflow-hidden rounded-md">
            <Image
              src={STORY_IMAGES.large.src}
              alt={STORY_IMAGES.large.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 36vw, 70vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-10 left-[6%] aspect-[4/5] w-[46%] overflow-hidden rounded-md border-4 border-white sm:-bottom-12">
            <Image
              src={STORY_IMAGES.overlap.src}
              alt={STORY_IMAGES.overlap.alt}
              fill
              loading="eager"
              sizes="(min-width: 1024px) 18vw, 35vw"
              className="object-cover"
            />
          </div>
        </SectionReveal>

        {/* Right: female portrait (with an offset gray block behind it), then the Our Story copy below */}
        <SectionReveal x={60} delay={0.1} className="mt-20 lg:mt-0">
          <div className="relative ml-auto w-[68%] max-w-[280px] lg:w-[78%]">
            <div aria-hidden="true" className="absolute left-0 top-5 h-full w-full rounded-md bg-gray-light" />
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md">
              <Image
                src={STORY_IMAGES.female.src}
                alt={STORY_IMAGES.female.alt}
                fill
                loading="eager"
                sizes="(min-width: 1024px) 28vw, 55vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="mt-14 lg:mt-16">
            <h2 className="text-3xl font-semibold sm:text-4xl lg:text-[34px]">
              <span className="text-text-gray/40">Our</span> <span className="text-text-dark">Story</span>
            </h2>
            <div className="mt-6 max-w-md space-y-4">
              {STORY_PARAGRAPHS.map((paragraph, index) => (
                <p key={index} className="text-[16px] leading-relaxed text-text-gray">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
