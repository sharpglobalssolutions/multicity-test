"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ApiRequestError,
  fetchSiteSettings,
  updateSiteSettings,
} from "@/lib/settings-api";

/**
 * Raw HTML/script injection — same idea as WordPress's "Insert Headers and
 * Footers" plugins. `headerCode` renders near the end of `<head>`,
 * `bodyCode` renders right after `<body>` opens, `footerCode` renders just
 * before `</body>` closes — all three site-wide (every page), via
 * `RawCodeInjector` in `app/layout.tsx`. The three-slot split matches how
 * Google Tag Manager's own install instructions are written (one snippet
 * for `<head>`, a second `<noscript>` snippet specifically for right after
 * `<body>` opens) alongside the more general header/footer use (Google
 * Analytics, a Search Console verification tag, a Meta/Facebook Pixel,
 * etc). This is trusted, admin-only input — same security model as the
 * rich-text editor's HTML output.
 */
export function SiteSettingsForm() {
  const [headerCode, setHeaderCode] = useState("");
  const [bodyCode, setBodyCode] = useState("");
  const [footerCode, setFooterCode] = useState("");
  const [cookieConsentEnabled, setCookieConsentEnabled] = useState(true);
  const [cookieConsentMessage, setCookieConsentMessage] = useState("");
  const [cookieConsentAcceptLabel, setCookieConsentAcceptLabel] = useState("");
  const [cookieConsentRejectLabel, setCookieConsentRejectLabel] = useState("");
  const [cookieConsentPolicyHref, setCookieConsentPolicyHref] = useState("");
  const [cookieConsentPrivacyHref, setCookieConsentPrivacyHref] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings()
      .then((settings) => {
        if (cancelled) return;
        setHeaderCode(settings?.headerCode ?? "");
        setBodyCode(settings?.bodyCode ?? "");
        setFooterCode(settings?.footerCode ?? "");
        setCookieConsentEnabled(settings?.cookieConsentEnabled ?? true);
        setCookieConsentMessage(settings?.cookieConsentMessage ?? "");
        setCookieConsentAcceptLabel(settings?.cookieConsentAcceptLabel ?? "");
        setCookieConsentRejectLabel(settings?.cookieConsentRejectLabel ?? "");
        setCookieConsentPolicyHref(settings?.cookieConsentPolicyHref ?? "");
        setCookieConsentPrivacyHref(settings?.cookieConsentPrivacyHref ?? "");
      })
      .catch((error) => {
        toast.error(
          error instanceof ApiRequestError
            ? error.message
            : "Couldn't load site settings.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await updateSiteSettings({
        headerCode: headerCode.trim() || null,
        bodyCode: bodyCode.trim() || null,
        footerCode: footerCode.trim() || null,
        cookieConsentEnabled,
        cookieConsentMessage: cookieConsentMessage.trim() || null,
        cookieConsentAcceptLabel: cookieConsentAcceptLabel.trim() || null,
        cookieConsentRejectLabel: cookieConsentRejectLabel.trim() || null,
        cookieConsentPolicyHref: cookieConsentPolicyHref.trim() || null,
        cookieConsentPrivacyHref: cookieConsentPrivacyHref.trim() || null,
      });
      toast.success("Settings saved.");
    } catch (error) {
      toast.error(
        error instanceof ApiRequestError
          ? error.message
          : "Couldn't save site settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Header, Body &amp; Footer Scripts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cookie Consent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Header, Body &amp; Footer Scripts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1.5">
            <Label htmlFor="headerCode">Header code</Label>
            <Textarea
              id="headerCode"
              value={headerCode}
              onChange={(event) => setHeaderCode(event.target.value)}
              disabled={saving}
              rows={8}
              placeholder={
                "<script>\n  // e.g. Google Analytics, Google Tag Manager's <head> snippet, a site verification meta tag, etc.\n</script>"
              }
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Injected near the end of every page&apos;s{" "}
              <code>&lt;head&gt;</code>, site-wide.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bodyCode">Body code</Label>
            <Textarea
              id="bodyCode"
              value={bodyCode}
              onChange={(event) => setBodyCode(event.target.value)}
              disabled={saving}
              rows={8}
              placeholder={
                "<noscript>\n  <!-- e.g. Google Tag Manager's <noscript> snippet -->\n</noscript>"
              }
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Injected right after the opening <code>&lt;body&gt;</code> tag,
              site-wide.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="footerCode">Footer code</Label>
            <Textarea
              id="footerCode"
              value={footerCode}
              onChange={(event) => setFooterCode(event.target.value)}
              disabled={saving}
              rows={8}
              placeholder={
                "<script>\n  // e.g. a chat widget, a tracking pixel, etc.\n</script>"
              }
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Injected just before the closing <code>&lt;/body&gt;</code>,
              site-wide.
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cookie Consent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <input
              id="cookieConsentEnabled"
              type="checkbox"
              checked={cookieConsentEnabled}
              onChange={(event) =>
                setCookieConsentEnabled(event.target.checked)
              }
              disabled={saving}
              className="h-4 w-4 rounded border-input"
            />
            <Label
              htmlFor="cookieConsentEnabled"
              className="cursor-pointer font-normal"
            >
              Show the cookie consent banner, and hold header/body/footer
              scripts above until a visitor accepts
            </Label>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cookieConsentMessage">Banner message</Label>
            <Textarea
              id="cookieConsentMessage"
              value={cookieConsentMessage}
              onChange={(event) => setCookieConsentMessage(event.target.value)}
              disabled={saving}
              rows={3}
              placeholder="We use cookies to improve your experience and for analytics. By clicking “Accept”, you agree to our use of cookies."
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cookieConsentAcceptLabel">
                Accept button label
              </Label>
              <Input
                id="cookieConsentAcceptLabel"
                value={cookieConsentAcceptLabel}
                onChange={(event) =>
                  setCookieConsentAcceptLabel(event.target.value)
                }
                disabled={saving}
                placeholder="Accept"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cookieConsentRejectLabel">
                Reject button label
              </Label>
              <Input
                id="cookieConsentRejectLabel"
                value={cookieConsentRejectLabel}
                onChange={(event) =>
                  setCookieConsentRejectLabel(event.target.value)
                }
                disabled={saving}
                placeholder="Reject"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cookieConsentPolicyHref">
                Cookie Policy link
              </Label>
              <Input
                id="cookieConsentPolicyHref"
                value={cookieConsentPolicyHref}
                onChange={(event) =>
                  setCookieConsentPolicyHref(event.target.value)
                }
                disabled={saving}
                placeholder="/cookie-policy"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cookieConsentPrivacyHref">
                Privacy Policy link
              </Label>
              <Input
                id="cookieConsentPrivacyHref"
                value={cookieConsentPrivacyHref}
                onChange={(event) =>
                  setCookieConsentPrivacyHref(event.target.value)
                }
                disabled={saving}
                placeholder="/privacy-policy"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
