"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ApiRequestError, fetchSiteSettings, updateSiteSettings } from "@/lib/settings-api";

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
      })
      .catch((error) => {
        toast.error(error instanceof ApiRequestError ? error.message : "Couldn't load site settings.");
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
      });
      toast.success("Settings saved.");
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "Couldn't save site settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
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
    );
  }

  return (
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
            placeholder={'<script>\n  // e.g. Google Analytics, Google Tag Manager\'s <head> snippet, a site verification meta tag, etc.\n</script>'}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Injected near the end of every page&apos;s <code>&lt;head&gt;</code>, site-wide.
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
            placeholder={"<noscript>\n  <!-- e.g. Google Tag Manager's <noscript> snippet -->\n</noscript>"}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Injected right after the opening <code>&lt;body&gt;</code> tag, site-wide.
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
            placeholder={"<script>\n  // e.g. a chat widget, a tracking pixel, etc.\n</script>"}
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            Injected just before the closing <code>&lt;/body&gt;</code>, site-wide.
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
}
