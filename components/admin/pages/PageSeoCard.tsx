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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPageSeo(pageId)
      .then((seo) => {
        if (cancelled) return;
        setSeoTitle(seo?.seoTitle ?? "");
        setMetaDescription(seo?.metaDescription ?? "");
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
    setSaving(true);
    try {
      await updatePageSeo(pageId, {
        seoTitle: seoTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
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
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save SEO"}
        </Button>
      </CardFooter>
    </Card>
  );
}
