"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import type { BlogCategory } from "@prisma/client";
import { ArrowLeft, Loader2, Trash2, UploadCloud, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { PageStatusBadge } from "@/components/admin/pages/PageStatusBadge";
import {
  ApiRequestError,
  createBlogPost,
  deleteBlogPost,
  fetchBlogCategories,
  fetchBlogPostById,
  publishBlogPost,
  unpublishBlogPost,
  updateBlogPost,
} from "@/lib/blog-api";
import type { PublicBlogPost } from "@/services/blog.service";

interface BlogPostFormProps {
  mode: "create" | "edit";
  /** Required when `mode === "edit"`. */
  postId?: string;
}

interface FieldErrors {
  title?: string;
  slug?: string;
  content?: string;
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

export function BlogPostForm({ mode, postId }: BlogPostFormProps) {
  const router = useRouter();

  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">(mode === "edit" ? "loading" : "loaded");
  const [loadError, setLoadError] = useState("");
  const [existingPost, setExistingPost] = useState<PublicBlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [readingTime, setReadingTime] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [pendingAction, setPendingAction] = useState<LifecycleAction | null>(null);

  useEffect(() => {
    fetchBlogCategories()
      .then(setCategories)
      .catch(() => {
        // Suggestions are a nicety, not a requirement — a failed fetch
        // just means the category field has no autocomplete this load.
      });
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !postId) return;

    let cancelled = false;
    async function load() {
      setLoadState("loading");
      try {
        const loaded = await fetchBlogPostById(postId!);
        if (cancelled) return;
        setExistingPost(loaded);
        setTitle(loaded.title);
        setSlug(loaded.slug);
        setExcerpt(loaded.excerpt ?? "");
        setContent(loaded.content);
        setFeaturedImage(loaded.featured_image ?? "");
        setCategory(loaded.category?.name ?? "");
        setTagsInput(loaded.tags.join(", "));
        setReadingTime(loaded.reading_time ? String(loaded.reading_time) : "");
        setLoadState("loaded");
      } catch (error) {
        if (cancelled) return;
        setLoadError(error instanceof ApiRequestError ? error.message : "Failed to load this blog post.");
        setLoadState("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [mode, postId]);

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
    if (!content.trim()) errors.content = "Content is required.";
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
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const input = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || undefined,
        content,
        featuredImage: featuredImage || undefined,
        category: category.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        readingTime: readingTime ? Number(readingTime) : undefined,
      };

      if (mode === "create") {
        const created = await createBlogPost(input);
        toast.success(`"${created.title}" was created.`);
      } else {
        const updated = await updateBlogPost(existingPost!.id, input);
        toast.success(`"${updated.title}" was updated.`);
      }
      router.push("/admin/blog");
    } catch (error) {
      if (error instanceof ApiRequestError) {
        if (error.code === "CONFLICT") {
          setFieldErrors((current) => ({ ...current, slug: error.message }));
        } else if (error.details.length > 0) {
          const next: FieldErrors = {};
          for (const detail of error.details) {
            if (detail.field && detail.field in { title: 1, slug: 1, content: 1 }) {
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
    if (!pendingAction || !existingPost) return;
    try {
      if (pendingAction === "delete") {
        await deleteBlogPost(existingPost.id);
        toast.success("Blog post deleted.");
        router.push("/admin/blog");
        return;
      }
      const updated =
        pendingAction === "publish" ? await publishBlogPost(existingPost.id) : await unpublishBlogPost(existingPost.id);
      setExistingPost(updated);
      toast.success(pendingAction === "publish" ? "Post published." : "Post unpublished.");
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
            <Skeleton className="h-40 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (mode === "edit" && loadState === "error") {
    return (
      <Card>
        <ErrorState
          title="Couldn't load this blog post"
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
          render={<Link href="/admin/blog" aria-label="Back to blog posts" />}
        >
          <ArrowLeft />
        </Button>
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {mode === "create" ? "Add Blog Post" : "Edit Blog Post"}
          </h1>
          {existingPost ? (
            <p className="text-sm text-muted-foreground">
              Last updated {dateFormatter.format(new Date(existingPost.updated_at))}
            </p>
          ) : null}
        </div>
      </div>

      <Card>
        {existingPost ? (
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <PageStatusBadge status={existingPost.published_at ? "PUBLISHED" : "DRAFT"} />
            </CardTitle>
            <div className="flex gap-2">
              {existingPost.published_at ? (
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
                placeholder="e.g. how-to-book-multi-city-flights"
              />
              {fieldErrors.slug ? (
                <p className="text-xs text-destructive">{fieldErrors.slug}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Renders at /insights/{slug || "…"} — lowercase words separated by hyphens.
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                disabled={submitting}
                rows={2}
                placeholder="A short summary shown on the article card and used as the meta description."
              />
            </div>

            <div className="space-y-1.5">
              <Label>Featured image</Label>
              <ImageUploadField value={featuredImage} onChange={setFeaturedImage} disabled={submitting} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor value={content} onChange={setContent} placeholder="Start writing the article…" />
              {fieldErrors.content ? <p className="text-xs text-destructive">{fieldErrors.content}</p> : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  list="blog-category-suggestions"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  disabled={submitting}
                  placeholder="e.g. Business Class"
                />
                <datalist id="blog-category-suggestions">
                  {categories.map((option) => (
                    <option key={option.id} value={option.name} />
                  ))}
                </datalist>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tagsInput}
                  onChange={(event) => setTagsInput(event.target.value)}
                  disabled={submitting}
                  placeholder="Comma separated"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="readingTime">Reading time (min)</Label>
                <Input
                  id="readingTime"
                  type="number"
                  min={1}
                  value={readingTime}
                  onChange={(event) => setReadingTime(event.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            {formError ? <p className="text-sm text-destructive">{formError}</p> : null}
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button variant="outline" nativeButton={false} render={<Link href="/admin/blog" />} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving…
                </>
              ) : mode === "create" ? (
                "Create Post"
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
            ? "Delete this post?"
            : pendingAction === "publish"
              ? "Publish this post?"
              : "Unpublish this post?"
        }
        description={
          pendingAction === "delete"
            ? "This permanently deletes the blog post. This can't be undone."
            : pendingAction === "publish"
              ? "This post will become visible on the live site."
              : "This post will be taken off the live site and reverted to a draft."
        }
        confirmLabel={pendingAction === "delete" ? "Delete" : pendingAction === "publish" ? "Publish" : "Unpublish"}
        destructive={pendingAction === "delete"}
        onConfirm={handleLifecycleAction}
      />
    </div>
  );
}
