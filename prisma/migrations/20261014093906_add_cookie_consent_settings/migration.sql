-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "cookieConsentAcceptLabel" TEXT,
ADD COLUMN     "cookieConsentEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cookieConsentMessage" TEXT,
ADD COLUMN     "cookieConsentPolicyHref" TEXT,
ADD COLUMN     "cookieConsentRejectLabel" TEXT;
