import Image from "next/image";
import { Button } from "@/components/Button";

const CALL_EXPERT_HREF = "tel:1869-504-657";
const DEFAULT_IMAGE = "/images/plan-img.webp";

export interface BlogHelpCardProps {
  heading?: string;
  body?: string;
  image?: string;
}

/** Small promotional card in the blog sidebar — same on every post, not
 * tied to any one article's data, so every prop is optional with a
 * sensible hardcoded default (see `Hero.tsx` for the rationale) rather
 * than requiring the page to supply it. */
export function BlogHelpCard({
  heading = "Need Help Planning Your Multi-City Trip?",
  body = "Speak with a specialist who can evaluate routing, airlines and fares for your exact itinerary.",
  image = DEFAULT_IMAGE,
}: BlogHelpCardProps = {}) {
  return (
    <div className="overflow-hidden rounded-card bg-sky-50">
      <div className="relative h-32 w-full">
        <Image src={image} alt="" fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover" />
      </div>
      <div className="p-5">
        <p className="text-base font-semibold text-text-dark">{heading}</p>
        <p className="mt-2 text-sm leading-relaxed text-text-gray">{body}</p>
        <Button href={CALL_EXPERT_HREF} variant="navy" className="mt-4 w-full justify-center text-sm">
          Speak With a Travel Expert
        </Button>
      </div>
    </div>
  );
}
