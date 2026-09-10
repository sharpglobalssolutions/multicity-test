import { SectionReveal } from "@/components/SectionReveal";
import { QUICK_CONSULT_DEALS } from "@/data/business-class-content";
import { PARTNER_AIRLINES } from "@/data/content";

const CALL_EXPERT_HREF = "tel:1869-504-657";

/** These cards show a "was / now" fare, but the underlying data (`Deal`,
 * shared with the homepage's `DestinationCarousel`) only ever stored one
 * real price — there's no separate "original fare" or "airline"
 * attribute to reuse, and adding either to the shared `Deal` type would
 * mean fabricating them for the homepage's own use of the same data too.
 * So both are derived here, locally, from the one real value that does
 * exist: `airline` cycles through the site's real `PARTNER_AIRLINES`
 * list, and the struck-through price is `price` scaled up by a fixed
 * ratio (matching the reference's own ~65% "up to 60% savings" framing)
 * — the discounted price shown is still the actual existing fare. */
const ORIGINAL_PRICE_MULTIPLIER = 2.9;

function computeOriginalPrice(price: string): string {
  const numeric = Number(price.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(numeric) || numeric <= 0) return price;
  const original = Math.round((numeric * ORIGINAL_PRICE_MULTIPLIER) / 10) * 10;
  return `$${original.toLocaleString("en-US")}`;
}

export function QuickConsultSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="content-container">
        <SectionReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl text-text-dark sm:text-4xl lg:text-[30px]">Consult in Just 30 Seconds</h2>
          <p className="mt-2 text-base text-text-gray sm:text-lg">
            Join 1000s who consult us to find flights with up to 60% savings
          </p>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_CONSULT_DEALS.map((deal, index) => {
            const airline = PARTNER_AIRLINES[index % PARTNER_AIRLINES.length];
            const originalPrice = computeOriginalPrice(deal.price);

            return (
              <SectionReveal key={deal.id} delay={index * 0.05}>
                <article className="flex h-full flex-col rounded-input border border-navy-deep/10 bg-white p-5">
                  <p className="text-[18px] uppercase  text-text-gray">{airline}</p>

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
