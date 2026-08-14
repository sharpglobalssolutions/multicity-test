-- CreateEnum
CREATE TYPE "CabinClass" AS ENUM ('ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST');

-- CreateTable
CREATE TABLE "flight_offers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "cabinClass" "CabinClass" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "originalPrice" DECIMAL(10,2),
    "offerLabel" TEXT,
    "description" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flight_offers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_offer_segments" (
    "id" TEXT NOT NULL,
    "flightOfferId" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "flightNumber" TEXT NOT NULL,
    "originAirportId" TEXT NOT NULL,
    "destinationAirportId" TEXT NOT NULL,
    "departureAt" TIMESTAMP(3) NOT NULL,
    "arrivalAt" TIMESTAMP(3) NOT NULL,
    "cabinClass" "CabinClass" NOT NULL,
    "bookingClass" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "stops" INTEGER NOT NULL DEFAULT 0,
    "baggage" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "flight_offer_segments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flight_offers_airlineId_idx" ON "flight_offers"("airlineId");

-- CreateIndex
CREATE INDEX "flight_offers_cabinClass_idx" ON "flight_offers"("cabinClass");

-- CreateIndex
CREATE INDEX "flight_offers_isActive_idx" ON "flight_offers"("isActive");

-- CreateIndex
CREATE INDEX "flight_offers_featured_idx" ON "flight_offers"("featured");

-- CreateIndex
CREATE INDEX "flight_offers_validFrom_idx" ON "flight_offers"("validFrom");

-- CreateIndex
CREATE INDEX "flight_offers_validUntil_idx" ON "flight_offers"("validUntil");

-- CreateIndex
CREATE INDEX "flight_offer_segments_flightOfferId_sortOrder_idx" ON "flight_offer_segments"("flightOfferId", "sortOrder");

-- CreateIndex
CREATE INDEX "flight_offer_segments_airlineId_idx" ON "flight_offer_segments"("airlineId");

-- CreateIndex
CREATE INDEX "flight_offer_segments_originAirportId_idx" ON "flight_offer_segments"("originAirportId");

-- CreateIndex
CREATE INDEX "flight_offer_segments_destinationAirportId_idx" ON "flight_offer_segments"("destinationAirportId");

-- CreateIndex
CREATE INDEX "flight_offer_segments_departureAt_idx" ON "flight_offer_segments"("departureAt");

-- AddForeignKey
ALTER TABLE "flight_offers" ADD CONSTRAINT "flight_offers_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_offer_segments" ADD CONSTRAINT "flight_offer_segments_flightOfferId_fkey" FOREIGN KEY ("flightOfferId") REFERENCES "flight_offers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_offer_segments" ADD CONSTRAINT "flight_offer_segments_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_offer_segments" ADD CONSTRAINT "flight_offer_segments_originAirportId_fkey" FOREIGN KEY ("originAirportId") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flight_offer_segments" ADD CONSTRAINT "flight_offer_segments_destinationAirportId_fkey" FOREIGN KEY ("destinationAirportId") REFERENCES "airports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
