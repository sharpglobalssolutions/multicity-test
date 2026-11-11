import { FlightSummaryCard } from "@/components/quote/FlightSummaryCard";
import { QuoteForm } from "@/components/quote/QuoteForm";
import type { QuoteCriteria } from "@/lib/quoteQuery";
import type { QtFormTrustStat, QtSummaryImage } from "@/types/page-sections";

export interface FlightQuoteSectionProps {
  criteria: QuoteCriteria;
  summaryImages?: QtSummaryImage[];
  phoneNumber?: string;
  agentPhoto?: string;
  trustStats?: QtFormTrustStat[];
}

export function FlightQuoteSection({
  criteria,
  summaryImages,
  phoneNumber,
  agentPhoto,
  trustStats,
}: FlightQuoteSectionProps) {
  return (
    <section className="bg-gray-light pb-10 pt-28 sm:pb-14 sm:pt-32">
      <div className="content-container grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.7fr_1fr] lg:gap-10">
        <FlightSummaryCard
          fromCity={criteria.from.city}
          fromIata={criteria.from.iata}
          toCity={criteria.to.city}
          toIata={criteria.to.iata}
          cabinClass={criteria.cabinClass}
          tripType={criteria.tripType}
          passengers={criteria.passengers}
          images={summaryImages}
        />
        <QuoteForm
          criteria={criteria}
          phoneNumber={phoneNumber}
          agentPhoto={agentPhoto}
          trustStats={trustStats}
        />
      </div>
    </section>
  );
}
