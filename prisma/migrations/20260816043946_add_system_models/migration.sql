-- CreateEnum
CREATE TYPE "FormSubmissionStatus" AS ENUM ('PENDING', 'PROCESSED', 'SPAM', 'ARCHIVED');

-- CreateTable
CREATE TABLE "form_submissions" (
    "id" TEXT NOT NULL,
    "formType" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "payload" JSONB NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" "FormSubmissionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "navigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "navigation_items" (
    "id" TEXT NOT NULL,
    "navigationId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "navigation_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL,
    "siteName" TEXT NOT NULL,
    "logoId" TEXT,
    "faviconId" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "socialLinks" JSONB,
    "defaultSeoTitle" TEXT,
    "defaultSeoDescription" TEXT,
    "defaultOgImageId" TEXT,
    "gaId" TEXT,
    "gtmId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "form_submissions_formType_idx" ON "form_submissions"("formType");

-- CreateIndex
CREATE INDEX "form_submissions_status_idx" ON "form_submissions"("status");

-- CreateIndex
CREATE INDEX "form_submissions_createdAt_idx" ON "form_submissions"("createdAt");

-- CreateIndex
CREATE INDEX "form_submissions_email_idx" ON "form_submissions"("email");

-- CreateIndex
CREATE UNIQUE INDEX "navigation_location_key" ON "navigation"("location");

-- CreateIndex
CREATE INDEX "navigation_items_navigationId_sortOrder_idx" ON "navigation_items"("navigationId", "sortOrder");

-- CreateIndex
CREATE INDEX "navigation_items_parentId_idx" ON "navigation_items"("parentId");

-- CreateIndex
CREATE INDEX "navigation_items_isActive_idx" ON "navigation_items"("isActive");

-- CreateIndex
CREATE INDEX "site_settings_logoId_idx" ON "site_settings"("logoId");

-- CreateIndex
CREATE INDEX "site_settings_faviconId_idx" ON "site_settings"("faviconId");

-- CreateIndex
CREATE INDEX "site_settings_defaultOgImageId_idx" ON "site_settings"("defaultOgImageId");

-- AddForeignKey
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_navigationId_fkey" FOREIGN KEY ("navigationId") REFERENCES "navigation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "navigation_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_faviconId_fkey" FOREIGN KEY ("faviconId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_defaultOgImageId_fkey" FOREIGN KEY ("defaultOgImageId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
