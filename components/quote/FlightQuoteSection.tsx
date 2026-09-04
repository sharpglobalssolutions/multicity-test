import { FlightSummaryCard } from "@/components/quote/FlightSummaryCard";
import { QuoteForm } from "@/components/quote/QuoteForm";
import type { QuoteCriteria } from "@/lib/quoteQuery";

export interface FlightQuoteSectionProps {
  criteria: QuoteCriteria;
}

export function FlightQuoteSection({ criteria }: FlightQuoteSectionProps) {
  return (
    <section className="bg-gray-light py-16 sm:py-26">
      <div className="content-container grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.7fr_1fr] lg:gap-10">
        <FlightSummaryCard
          fromCity={criteria.from.city}
          fromIata={criteria.from.iata}
          toCity={criteria.to.city}
          toIata={criteria.to.iata}
          cabinClass={criteria.cabinClass}
          tripType={criteria.tripType}
          passengers={criteria.passengers}
        />
        <QuoteForm criteria={criteria} />
      </div>
    </section>
  );
}
