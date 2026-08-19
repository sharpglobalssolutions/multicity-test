"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type { Page } from "@prisma/client";
import { ArrowLeft, Loader2, Trash2, UploadCloud, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ApiRequestError,
  createPage,
  deletePage,
  fetchPageById,
  publishPage,
  unpublishPage,
  updatePage,
} from "@/lib/pages-api";
import { PageStatusBadge } from "@/components/admin/pages/PageStatusBadge";

interface PageFormProps {
  mode: "create" | "edit";
  /** Required when `mode === "edit"`. */
  pageId?: string;
}

interface FieldErrors {
  title?: string;
  slug?: string;
  pageType?: string;
  template?: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

type LifecycleAction = "delete" | "publish" | "unpublish";

export function PageForm({ mode, pageId }: PageFormProps) {
  const router = useRouter();

  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">(mode === "edit" ? "loading" : "loaded");
  const [loadError, setLoadError] = useState("");
  const [existingPage, setExistingPage] = useState<Page | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [pageType, setPageType] = useState("");
  const [template, setTemplate] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [pendingAction, setPendingAction] = useState<LifecycleAction | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !pageId) return;

    let cancelled = false;
    async function load() {
      setLoadState("loading");
      try {
        const loaded = await fetchPageById(pageId!);
        if (cancelled) return;
        setExistingPage(loaded);
        setTitle(loaded.title);
        setSlug(loaded.slug);
        setPageType(loaded.pageType);
        setTemplate(loaded.template);
        setLoadState("loaded");
      } catch (error) {
        if (cancelled) return;
        setLoadError(error instanceof ApiRequestError ? error.message : "Failed to load this page.");
        setLoadState("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [mode, pageId]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (mode === "create" && !slugTouched) {
      setSlug(slugify(value));
    }
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!title.trim()) errors.title = "Title is required.";
    if (!slug.trim()) errors.slug = "Slug is required.";
    else if (!SLUG_PATTERN.test(slug.trim())) {
      errors.slug = "Slug must be lowercase, alphanumeric words separated by hyphens.";
    }
    if (!pageType.trim()) errors.pageType = "Page type is required.";
    if (!template.trim()) errors.template = "Template is required.";
    return errors;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const input = {
        title: title.trim(),
        slug: slug.trim(),
        pageType: pageType.trim(),
        template: template.trim(),
      };

      if (mode === "create") {
        const created = await createPage(input);
        toast.success(`"${created.title}" was created.`);
      } else {
        const updated = await updatePage(pageId!, input);
        toast.success(`"${updated.title}" was updated.`);
      }
      router.push("/admin/pages");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === "CONFLICT") {
          setFieldErrors((current) => ({ ...current, slug: error.message }));
        } else if (error.details.length > 0) {
          const next: FieldErrors = {};
          for (const detail of error.details) {
            if (detail.field && detail.field in { title: 1, slug: 1, pageType: 1, template: 1 }) {
              next[detail.field as keyof FieldErrors] = detail.message;
            }
          }
          setFieldErrors(next);
          if (Object.keys(next).length === 0) setFormError(error.message);
        } else {
          setFormError(error.message);
        }
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLifecycleAction() {
    if (!pendingAction || !pageId) return;
    try {
      if (pendingAction === "delete") {
        await deletePage(pageId);
        toast.success("Page deleted.");
        router.push("/admin/pages");
        return;
      }
      const updated = pendingAction === "publish" ? await publishPage(pageId) : await unpublishPage(pageId);
      setExistingPage(updated);
      toast.success(pendingAction === "publish" ? "Page published." : "Page unpublished.");
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "That action failed. Please try again.");
      throw error;
    }
  }

  if (mode === "edit" && loadState === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Card className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (mode === "edit" && loadState === "error") {
    return (
      <Card>
        <ErrorState
          title="Couldn't load this page"
          description={loadError}
          onRetry={() => window.location.reload()}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={<Link href="/admin/pages" aria-label="Back to pages" />}
        >
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {mode === "create" ? "Create Page" : "Edit Page"}
          </h1>
          {existingPage ? (
            <p className="text-sm text-muted-foreground">
              Last updated {dateFormatter.format(new Date(existingPage.updatedAt))}
            </p>
          ) : null}
        </div>
      </div>

      <Card>
        {existingPage ? (
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <PageStatusBadge status={existingPage.status} />
            </CardTitle>
            <div className="flex gap-2">
              {existingPage.status === "PUBLISHED" ? (
                <Button variant="outline" size="sm" onClick={() => setPendingAction("unpublish")}>
                  <XCircle />
                  Unpublish
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setPendingAction("publish")}>
                  <UploadCloud />
                  Publish
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setPendingAction("delete")}
              >
                <Trash2 />
                Delete
              </Button>
            </div>
          </CardHeader>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.title)}
                autoFocus
              />
              {fieldErrors.title ? <p className="text-xs text-destructive">{fieldErrors.title}</p> : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setSlug(event.target.value.toLowerCase());
                }}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.slug)}
                placeholder="e.g. about-us"
              />
              {fieldErrors.slug ? (
                <p className="text-xs text-destructive">{fieldErrors.slug}</p>
              ) : (
                <p className="text-xs text-muted-foreground">Lowercase words separated by hyphens.</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pageType">Page type</Label>
                <Input
                  id="pageType"
                  value={pageType}
                  onChange={(event) => setPageType(event.target.value)}
                  disabled={submitting}
                  aria-invalid={Boolean(fieldErrors.pageType)}
                  placeholder="e.g. standard"
                />
                {fieldErrors.pageType ? (
                  <p className="text-xs text-destructive">{fieldErrors.pageType}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="template">Template</Label>
                <Input
                  id="template"
                  value={template}
                  onChange={(event) => setTemplate(event.target.value)}
                  disabled={submitting}
                  aria-invalid={Boolean(fieldErrors.template)}
                  placeholder="e.g. default"
                />
                {fieldErrors.template ? (
                  <p className="text-xs text-destructive">{fieldErrors.template}</p>
                ) : null}
              </div>
            </div>

            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button variant="outline" nativeButton={false} render={<Link href="/admin/pages" />} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving…
                </>
              ) : mode === "create" ? (
                "Create Page"
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <ConfirmDialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
        title={
          pendingAction === "delete"
            ? "Delete this page?"
            : pendingAction === "publish"
              ? "Publish this page?"
              : "Unpublish this page?"
        }
        description={
          pendingAction === "delete"
            ? "This permanently deletes the page and all of its sections. This can't be undone."
            : pendingAction === "publish"
              ? "This page will become visible on the live site."
              : "This page will be taken off the live site and reverted to a draft."
        }
        confirmLabel={pendingAction === "delete" ? "Delete" : pendingAction === "publish" ? "Publish" : "Unpublish"}
        destructive={pendingAction === "delete"}
        onConfirm={handleLifecycleAction}
      />
    </div>
  );
}
