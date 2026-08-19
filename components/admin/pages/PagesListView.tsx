"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ContentStatus, Page } from "@prisma/client";
import {
  FileText,
  Loader2,
  MoreHorizontal,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  ApiRequestError,
  deletePage,
  fetchPages,
  publishPage,
  unpublishPage,
  type PaginationMeta,
} from "@/lib/pages-api";
import { PageStatusBadge } from "@/components/admin/pages/PageStatusBadge";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const STATUS_FILTERS: { value: "ALL" | ContentStatus; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

// Lets `<SelectValue>` render the friendly label instead of the raw enum
// value (e.g. "All statuses" instead of "ALL") once selected.
const STATUS_FILTER_LABELS = Object.fromEntries(STATUS_FILTERS.map((option) => [option.value, option.label]));

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

type PendingAction = { type: "delete" | "publish" | "unpublish"; page: Page };

export function PagesListView() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | ContentStatus>("ALL");
  const [page, setPage] = useState(1);

  const [pages, setPages] = useState<Page[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  // Debounce the raw input into `search`, resetting to page 1 on change.
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
      const result = await fetchPages({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: status === "ALL" ? undefined : status,
      });
      setPages(result.pages);
      setPagination(result.pagination);
      setLoadState("loaded");
    } catch (error) {
      setErrorMessage(error instanceof ApiRequestError ? error.message : "Failed to load pages.");
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
        await deletePage(pendingAction.page.id);
        toast.success(`"${pendingAction.page.title}" was deleted.`);
      } else if (pendingAction.type === "publish") {
        await publishPage(pendingAction.page.id);
        toast.success(`"${pendingAction.page.title}" is now published.`);
      } else {
        await unpublishPage(pendingAction.page.id);
        toast.success(`"${pendingAction.page.title}" was unpublished.`);
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
          <h1 className="font-heading text-xl font-semibold text-foreground">Pages</h1>
          <p className="text-sm text-muted-foreground">Manage the CMS pages that make up the site.</p>
        </div>
        <Button nativeButton={false} render={<Link href="/admin/pages/create" />}>
          <Plus />
          Create Page
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
              aria-label="Search pages"
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
            title="Couldn't load pages"
            description={errorMessage || "That request failed. Please try again."}
            onRetry={load}
          />
        ) : pages.length === 0 ? (
          <EmptyState
            icon={isFiltered ? XCircle : FileText}
            title={isFiltered ? "No pages match your filters" : "No pages yet"}
            description={
              isFiltered
                ? "Try a different search term or status filter."
                : "Get started by creating your first CMS page."
            }
            action={
              isFiltered ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : (
                <Button nativeButton={false} render={<Link href="/admin/pages/create" />}>
                  <Plus />
                  Create Page
                </Button>
              )
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{item.title}</span>
                      <span className="text-xs text-muted-foreground">/{item.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.pageType}</TableCell>
                  <TableCell>
                    <PageStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dateFormatter.format(new Date(item.updatedAt))}
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
                        <DropdownMenuItem render={<Link href={`/admin/pages/${item.id}/edit`} />}>
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                        {item.status === "PUBLISHED" ? (
                          <DropdownMenuItem
                            onClick={() => setPendingAction({ type: "unpublish", page: item })}
                          >
                            <XCircle />
                            Unpublish
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => setPendingAction({ type: "publish", page: item })}>
                            <UploadCloud />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setPendingAction({ type: "delete", page: item })}
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
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} page
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
            ? "Delete this page?"
            : pendingAction?.type === "publish"
              ? "Publish this page?"
              : "Unpublish this page?"
        }
        description={
          pendingAction?.type === "delete" ? (
            <>
              This permanently deletes <strong>&ldquo;{pendingAction.page.title}&rdquo;</strong> and all of its
              sections. This can&apos;t be undone.
            </>
          ) : pendingAction?.type === "publish" ? (
            <>
              <strong>&ldquo;{pendingAction.page.title}&rdquo;</strong> will become visible on the live site.
            </>
          ) : (
            <>
              <strong>&ldquo;{pendingAction?.page.title}&rdquo;</strong> will be taken off the live site and
              reverted to a draft.
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
