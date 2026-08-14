-- CreateTable
CREATE TABLE "airports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "iataCode" TEXT NOT NULL,
    "icaoCode" TEXT,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timezone" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "airports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airlines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "iataCode" TEXT NOT NULL,
    "icaoCode" TEXT,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "logoId" TEXT,
    "websiteUrl" TEXT,
    "description" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "airlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "airline_content" (
    "id" TEXT NOT NULL,
    "airlineId" TEXT NOT NULL,
    "overview" TEXT,
    "businessClassContent" TEXT,
    "firstClassContent" TEXT,
    "loungeContent" TEXT,
    "routeContent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "airline_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "airports_slug_key" ON "airports"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "airports_iataCode_key" ON "airports"("iataCode");

-- CreateIndex
CREATE UNIQUE INDEX "airports_icaoCode_key" ON "airports"("icaoCode");

-- CreateIndex
CREATE INDEX "airports_city_idx" ON "airports"("city");

-- CreateIndex
CREATE INDEX "airports_country_idx" ON "airports"("country");

-- CreateIndex
CREATE INDEX "airports_countryCode_idx" ON "airports"("countryCode");

-- CreateIndex
CREATE INDEX "airports_isActive_idx" ON "airports"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_slug_key" ON "airlines"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_iataCode_key" ON "airlines"("iataCode");

-- CreateIndex
CREATE UNIQUE INDEX "airlines_icaoCode_key" ON "airlines"("icaoCode");

-- CreateIndex
CREATE INDEX "airlines_country_idx" ON "airlines"("country");

-- CreateIndex
CREATE INDEX "airlines_countryCode_idx" ON "airlines"("countryCode");

-- CreateIndex
CREATE INDEX "airlines_isActive_idx" ON "airlines"("isActive");

-- CreateIndex
CREATE INDEX "airlines_isFeatured_idx" ON "airlines"("isFeatured");

-- CreateIndex
CREATE INDEX "airlines_sortOrder_idx" ON "airlines"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "airline_content_airlineId_key" ON "airline_content"("airlineId");

-- AddForeignKey
ALTER TABLE "airline_content" ADD CONSTRAINT "airline_content_airlineId_fkey" FOREIGN KEY ("airlineId") REFERENCES "airlines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
