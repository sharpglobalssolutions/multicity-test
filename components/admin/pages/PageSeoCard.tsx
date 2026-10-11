"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ApiRequestError, fetchPageSeo, updatePageSeo } from "@/lib/pages-api";

const TITLE_GUIDANCE = 60;
const DESCRIPTION_GUIDANCE = 155;

interface PageSeoCardProps {
  pageId: string;
}

export function PageSeoCard({ pageId }: PageSeoCardProps) {
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [schemaMarkup, setSchemaMarkup] = useState("");
  const [schemaError, setSchemaError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPageSeo(pageId)
      .then((seo) => {
        if (cancelled) return;
        setSeoTitle(seo?.seoTitle ?? "");
        setMetaDescription(seo?.metaDescription ?? "");
        setSchemaMarkup(seo?.schemaData ? JSON.stringify(seo.schemaData, null, 2) : "");
      })
      .catch(() => {
        // No SEO metadata yet is expected for most pages — leave fields blank.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pageId]);

  async function handleSave() {
    const trimmedSchema = schemaMarkup.trim();
    let schemaData: Record<string, unknown> | null = null;
    let schemaType: string | null = null;

    if (trimmedSchema) {
      try {
        const parsed = JSON.parse(trimmedSchema);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          throw new Error("Schema markup must be a single JSON object (e.g. { \"@type\": ... }).");
        }
        schemaData = parsed as Record<string, unknown>;
        schemaType = typeof schemaData["@type"] === "string" ? (schemaData["@type"] as string) : null;
        setSchemaError(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Schema markup isn't valid JSON.";
        setSchemaError(message);
        toast.error(message);
        return;
      }
    } else {
      setSchemaError(null);
    }

    setSaving(true);
    try {
      await updatePageSeo(pageId, {
        seoTitle: seoTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        schemaData,
        schemaType,
      });
      toast.success("SEO metadata saved.");
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "Couldn't save SEO metadata.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="seoTitle">Meta title</Label>
          <Input id="seoTitle" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} disabled={saving} />
          <p className="text-xs text-muted-foreground">
            {seoTitle.length}/{TITLE_GUIDANCE} characters (guidance — longer titles just get truncated in search results)
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="metaDescription">Meta description</Label>
          <Textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(event) => setMetaDescription(event.target.value)}
            disabled={saving}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            {metaDescription.length}/{DESCRIPTION_GUIDANCE} characters (guidance)
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="schemaMarkup">Schema markup (JSON-LD)</Label>
          <Textarea
            id="schemaMarkup"
            value={schemaMarkup}
            onChange={(event) => {
              setSchemaMarkup(event.target.value);
              if (schemaError) setSchemaError(null);
            }}
            disabled={saving}
            rows={8}
            placeholder={'{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "..."\n}'}
            className="font-mono text-xs"
            aria-invalid={schemaError ? true : undefined}
          />
          {schemaError ? (
            <p className="text-xs text-destructive">{schemaError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Paste a full JSON-LD structured-data object. Rendered on the page as-is; leave blank for none.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save SEO"}
        </Button>
      </CardFooter>
    </Card>
  );
}
