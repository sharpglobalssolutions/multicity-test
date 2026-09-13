import { SectionReveal } from "@/components/SectionReveal";
import { unsplash } from "@/lib/images";

const CALL_EXPERT_HREF = "tel:1869-504-657";

const ORIGINAL_PRICE_MULTIPLIER = 2.9;

function computeOriginalPrice(price: string): string {
  const numeric = Number(price.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return price;
  const original = Math.round((numeric * ORIGINAL_PRICE_MULTIPLIER) / 10) * 10;
  return `$${original.toLocaleString("en-US")}`;
}

export interface QuickConsultDeal {
  id: string;
  city: string;
  airline: string;
  price: string;
  image: string;
  alt: string;
}

/** Own independent deal list (previously `DEALS.slice(0, 6)` reused from
 * the homepage) — this page gets its own editable content rather than
 * reusing homepage-specific data. */
const DEFAULT_DEALS: QuickConsultDeal[] = [
  {
    id: "paris",
    city: "Paris",
    airline: "American Airlines",
    price: "$2,499",
    image: unsplash("1502602898657-3e91760cbb34"),
    alt: "The Eiffel Tower rising above the rooftops of Paris at dusk",
  },
  {
    id: "london",
    city: "London",
    airline: "British Airways",
    price: "$2,199",
    image: unsplash("1513635269975-59663e0ac1ad"),
    alt: "The Elizabeth Tower and Houses of Parliament in London",
  },
  {
    id: "dubai",
    city: "Dubai",
    airline: "Emirates",
    price: "$3,299",
    image: unsplash("1512453979798-5ea266f8880c"),
    alt: "The Dubai skyline with the Burj Khalifa at sunset",
  },
  {
    id: "singapore",
    city: "Singapore",
    airline: "Qatar Airways",
    price: "$3,899",
    image: unsplash("1525625293386-3f8f99389edd"),
    alt: "Marina Bay Sands and the Singapore skyline at night",
  },
  {
    id: "tokyo",
    city: "Tokyo",
    airline: "Lufthansa",
    price: "$3,099",
    image: unsplash("1540959733332-eab4deabeeaf"),
    alt: "The Tokyo skyline glowing at twilight",
  },
  {
    id: "new-york",
    city: "New York",
    airline: "Singapore Airlines",
    price: "$1,999",
    image: unsplash("1496442226666-8d4d0e62e6e9"),
    alt: "The Manhattan skyline viewed across the water at golden hour",
  },
];

export interface QuickConsultSectionProps {
  heading?: string;
  subheading?: string;
  deals?: QuickConsultDeal[];
}

/** All props optional, falling back to the current hardcoded default — see
 * `Hero.tsx` for the rationale. */
export function QuickConsultSection({
  heading = "Consult in Just 30 Seconds",
  subheading = "Join 1000s who consult us to find flights with up to 60% savings",
  deals = DEFAULT_DEALS,
}: QuickConsultSectionProps = {}) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">{heading}</h2>
          <p className="mt-2 text-base text-text-gray sm:text-lg">{subheading}</p>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal, index) => {
            const originalPrice = computeOriginalPrice(deal.price);

            return (
              <SectionReveal key={deal.id} delay={index * 0.05}>
                <article className="flex h-full flex-col rounded-input border border-navy-deep/10 bg-white p-5">
                  <p className="text-[18px] uppercase  text-text-gray">{deal.airline}</p>

                  <div className="mt-3 flex flex-1 items-baseline justify-between gap-3">
                    <span className="text-[18px]  text-text-dark">{deal.city}</span>
                    <span className="flex items-baseline gap-2 whitespace-nowrap">
                      <span className="text-sm text-text-gray line-through">{originalPrice}</span>
                      <span className="text-[18px]  text-text-dark">{deal.price}</span>
                    </span>
                  </div>

                  <a
                    href={CALL_EXPERT_HREF}
                    className="mt-4 block w-full rounded-btn bg-[#087f4f] py-3 text-center text-[16px] font-semibold text-white transition-colors hover:bg-[#066b41]"
                  >
                    Consult Discount Fare
                  </a>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
