"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ContentStatus } from "@prisma/client";
import {
  Loader2,
  MoreHorizontal,
  Newspaper,
  Pencil,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ApiRequestError,
  deleteBlogPost,
  fetchBlogPosts,
  publishBlogPost,
  unpublishBlogPost,
  type PaginationMeta,
} from "@/lib/blog-api";
import { PageStatusBadge } from "@/components/admin/pages/PageStatusBadge";
import type { PublicBlogPost } from "@/services/blog.service";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const STATUS_FILTERS: { value: "ALL" | ContentStatus; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const STATUS_FILTER_LABELS = Object.fromEntries(STATUS_FILTERS.map((option) => [option.value, option.label]));

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

type PendingAction = { type: "delete" | "publish" | "unpublish"; post: PublicBlogPost };

export function BlogPostsListView() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | ContentStatus>("ALL");
  const [page, setPage] = useState(1);

  const [posts, setPosts] = useState<PublicBlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoadState("loading");
    setErrorMessage("");
    try {
      const result = await fetchBlogPosts({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: status === "ALL" ? undefined : status,
      });
      setPosts(result.posts);
      setPagination(result.pagination);
      setLoadState("loaded");
    } catch (error) {
      setErrorMessage(error instanceof ApiRequestError ? error.message : "Failed to load blog posts.");
      setLoadState("error");
    } finally {
      setHasLoadedOnce(true);
    }
  }, [page, search, status]);

  useEffect(() => {
    load();
  }, [load]);

  function handleStatusChange(value: string | null) {
    setStatus((value ?? "ALL") as "ALL" | ContentStatus);
    setPage(1);
  }

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatus("ALL");
    setPage(1);
  }

  async function handleConfirmAction() {
    if (!pendingAction) return;
    try {
      if (pendingAction.type === "delete") {
        await deleteBlogPost(pendingAction.post.id);
        toast.success(`"${pendingAction.post.title}" was deleted.`);
      } else if (pendingAction.type === "publish") {
        await publishBlogPost(pendingAction.post.id);
        toast.success(`"${pendingAction.post.title}" is now published.`);
      } else {
        await unpublishBlogPost(pendingAction.post.id);
        toast.success(`"${pendingAction.post.title}" was unpublished.`);
      }
      await load();
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "That action failed. Please try again.");
      throw error;
    }
  }

  const isFiltered = Boolean(search) || status !== "ALL";
  const showInitialSkeleton = loadState === "loading" && !hasLoadedOnce;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-semibold text-foreground">Blog</h1>
          <p className="text-sm text-muted-foreground">Manage the articles that make up Travel Insights.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/blog/create" />}>
          <Plus />
          Add Blog Post
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by title or slug…"
              className="pl-8"
              aria-label="Search blog posts"
            />
          </div>
          <Select value={status} onValueChange={handleStatusChange} items={STATUS_FILTER_LABELS}>
            <SelectTrigger className="w-full sm:w-44" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {loadState === "loading" && hasLoadedOnce ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Refreshing…
            </span>
          ) : null}
        </div>
      </Card>

      <Card className="p-0">
        {showInitialSkeleton ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : loadState === "error" ? (
          <ErrorState
            title="Couldn't load blog posts"
            description={errorMessage || "That request failed. Please try again."}
            onRetry={load}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={isFiltered ? XCircle : Newspaper}
            title={isFiltered ? "No posts match your filters" : "No blog posts yet"}
            description={
              isFiltered
                ? "Try a different search term or status filter."
                : "Get started by adding your first blog post."
            }
            action={
              isFiltered ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button nativeButton={false} render={<Link href="/admin/blog/create" />}>
                  <Plus />
                  Add Blog Post
                </Button>
              )
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{item.title}</span>
                      <span className="text-xs text-muted-foreground">/insights/{item.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.category?.name ?? "—"}</TableCell>
                  <TableCell>
                    {/* PublicBlogPost doesn't carry `status` (deliberately
                        stripped for the public shape) — the admin list
                        query already filters by it, so re-deriving it
                        from `published_at` here is enough to badge each
                        row without widening that public type. */}
                    <PageStatusBadge status={item.published_at ? "PUBLISHED" : "DRAFT"} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(new Date(item.updated_at))}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for ${item.title}`}
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                      >
                        <MoreHorizontal />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem render={<Link href={`/admin/blog/${item.id}/edit`} />}>
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                        {item.published_at ? (
                          <DropdownMenuItem onClick={() => setPendingAction({ type: "unpublish", post: item })}>
                            <XCircle />
                            Unpublish
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => setPendingAction({ type: "publish", post: item })}>
                            <UploadCloud />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setPendingAction({ type: "delete", post: item })}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} post
            {pagination.total === 1 ? "" : "s"} total
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={pagination.page <= 1}
                  className={pagination.page <= 1 ? "pointer-events-none opacity-50" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    if (pagination.page > 1) setPage(pagination.page - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={pagination.page >= pagination.totalPages}
                  className={
                    pagination.page >= pagination.totalPages ? "pointer-events-none opacity-50" : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (pagination.page < pagination.totalPages) setPage(pagination.page + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}

      <ConfirmDialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
        title={
          pendingAction?.type === "delete"
            ? "Delete this post?"
            : pendingAction?.type === "publish"
              ? "Publish this post?"
              : "Unpublish this post?"
        }
        description={
          pendingAction?.type === "delete" ? (
            <>
              This permanently deletes <strong>&ldquo;{pendingAction.post.title}&rdquo;</strong>. This can&apos;t be
              undone.
            </>
          ) : pendingAction?.type === "publish" ? (
            <>
              <strong>&ldquo;{pendingAction.post.title}&rdquo;</strong> will become visible on the live site.
            </>
          ) : (
            <>
              <strong>&ldquo;{pendingAction?.post.title}&rdquo;</strong> will be taken off the live site and reverted
              to a draft.
            </>
          )
        }
        confirmLabel={
          pendingAction?.type === "delete" ? "Delete" : pendingAction?.type === "publish" ? "Publish" : "Unpublish"
        }
        destructive={pendingAction?.type === "delete"}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
