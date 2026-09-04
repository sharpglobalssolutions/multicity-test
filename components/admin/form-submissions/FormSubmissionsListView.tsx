"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormSubmission, FormSubmissionStatus } from "@prisma/client";
import { Archive, CheckCircle2, Clock, Eye, Inbox, Loader2, MoreHorizontal, ShieldAlert, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  fetchFormSubmissions,
  updateFormSubmissionStatus,
  type PaginationMeta,
} from "@/lib/form-submissions-api";
import { formTypeLabel, isIncompleteSubmission, KNOWN_FORM_TYPES } from "@/lib/form-submission-display";
import { FormSubmissionDetailDialog } from "@/components/admin/form-submissions/FormSubmissionDetailDialog";
import { FormSubmissionStatusBadge } from "@/components/admin/form-submissions/FormSubmissionStatusBadge";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const STATUS_FILTERS: { value: "ALL" | FormSubmissionStatus; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSED", label: "Processed" },
  { value: "SPAM", label: "Spam" },
  { value: "ARCHIVED", label: "Archived" },
];
const STATUS_FILTER_LABELS = Object.fromEntries(STATUS_FILTERS.map((option) => [option.value, option.label]));

const TYPE_FILTERS: { value: "ALL" | string; label: string }[] = [
  { value: "ALL", label: "All types" },
  ...KNOWN_FORM_TYPES,
];
const TYPE_FILTER_LABELS = Object.fromEntries(TYPE_FILTERS.map((option) => [option.value, option.label]));

const STATUS_ACTIONS: { status: FormSubmissionStatus; label: string; icon: typeof CheckCircle2 }[] = [
  { status: "PENDING", label: "Mark pending", icon: Clock },
  { status: "PROCESSED", label: "Mark processed", icon: CheckCircle2 },
  { status: "SPAM", label: "Mark spam", icon: ShieldAlert },
  { status: "ARCHIVED", label: "Archive", icon: Archive },
];

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

export function FormSubmissionsListView() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | FormSubmissionStatus>("ALL");
  const [formType, setFormType] = useState<"ALL" | string>("ALL");
  const [page, setPage] = useState(1);

  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "loaded" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const [viewing, setViewing] = useState<FormSubmission | null>(null);

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
      const result = await fetchFormSubmissions({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: status === "ALL" ? undefined : status,
        formType: formType === "ALL" ? undefined : formType,
      });
      setSubmissions(result.submissions);
      setPagination(result.pagination);
      setLoadState("loaded");
    } catch (error) {
      setErrorMessage(error instanceof ApiRequestError ? error.message : "Failed to load form submissions.");
      setLoadState("error");
    } finally {
      setHasLoadedOnce(true);
    }
  }, [page, search, status, formType]);

  useEffect(() => {
    load();
  }, [load]);

  function clearFilters() {
    setSearchInput("");
    setSearch("");
    setStatus("ALL");
    setFormType("ALL");
    setPage(1);
  }

  async function handleStatusAction(submission: FormSubmission, nextStatus: FormSubmissionStatus) {
    try {
      await updateFormSubmissionStatus(submission.id, nextStatus);
      toast.success("Status updated.");
      await load();
    } catch (error) {
      toast.error(error instanceof ApiRequestError ? error.message : "That action failed. Please try again.");
    }
  }

  const isFiltered = Boolean(search) || status !== "ALL" || formType !== "ALL";
  const showInitialSkeleton = loadState === "loading" && !hasLoadedOnce;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">Form Submissions</h1>
        <p className="text-sm text-muted-foreground">
          Leads captured from the site&apos;s forms — including flight searches abandoned before the contact step.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name, email, or phone…"
            className="sm:max-w-sm"
            aria-label="Search form submissions"
          />
          <Select
            value={status}
            onValueChange={(value) => {
              setStatus((value ?? "ALL") as "ALL" | FormSubmissionStatus);
              setPage(1);
            }}
            items={STATUS_FILTER_LABELS}
          >
            <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
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
          <Select
            value={formType}
            onValueChange={(value) => {
              setFormType(value ?? "ALL");
              setPage(1);
            }}
            items={TYPE_FILTER_LABELS}
          >
            <SelectTrigger className="w-full sm:w-48" aria-label="Filter by form type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPE_FILTERS.map((option) => (
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
            title="Couldn't load form submissions"
            description={errorMessage || "That request failed. Please try again."}
            onRetry={load}
          />
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={isFiltered ? XCircle : Inbox}
            title={isFiltered ? "No submissions match your filters" : "No form submissions yet"}
            description={
              isFiltered
                ? "Try a different search term or filter."
                : "Leads from the site's forms will show up here as visitors submit them."
            }
            action={
              isFiltered ? (
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((item) => {
                const incomplete = isIncompleteSubmission(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      {incomplete ? (
                        <span className="text-sm text-muted-foreground italic">Incomplete — no contact info</span>
                      ) : (
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{item.name || item.email || item.phone}</span>
                          {item.email ? <span className="text-xs text-muted-foreground">{item.email}</span> : null}
                          {item.phone ? <span className="text-xs text-muted-foreground">{item.phone}</span> : null}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formTypeLabel(item.formType)}</TableCell>
                    <TableCell>
                      <FormSubmissionStatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {dateFormatter.format(new Date(item.createdAt))}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label="Actions"
                          className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
                        >
                          <MoreHorizontal />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewing(item)}>
                            <Eye />
                            View details
                          </DropdownMenuItem>
                          {STATUS_ACTIONS.filter((action) => action.status !== item.status).map((action) => {
                            const Icon = action.icon;
                            return (
                              <DropdownMenuItem
                                key={action.status}
                                onClick={() => handleStatusAction(item, action.status)}
                              >
                                <Icon />
                                {action.label}
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} submission
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

      <FormSubmissionDetailDialog submission={viewing} onOpenChange={(open) => !open && setViewing(null)} />
    </div>
  );
}
