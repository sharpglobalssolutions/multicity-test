import type { FormSubmission } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formTypeLabel, isIncompleteSubmission } from "@/lib/form-submission-display";
import { FormSubmissionStatusBadge } from "@/components/admin/form-submissions/FormSubmissionStatusBadge";

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" });

function humanizeKey(key: string): string {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase());
}

/** An airport, as `FlightSearch`/`QuoteForm` submit it in `payload.from`/
 * `payload.to` — shown as "City (IATA)" instead of a raw JSON dump. */
function isAirportLike(value: unknown): value is { city?: unknown; iata?: unknown } {
  return typeof value === "object" && value !== null && ("iata" in value || "city" in value);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (isAirportLike(value)) {
    const city = typeof value.city === "string" ? value.city : null;
    const iata = typeof value.iata === "string" ? value.iata : null;
    if (city && iata) return `${city} (${iata})`;
    return city ?? iata ?? JSON.stringify(value);
  }
  if (Array.isArray(value)) return value.map(formatValue).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

interface FormSubmissionDetailDialogProps {
  submission: FormSubmission | null;
  onOpenChange: (open: boolean) => void;
}

export function FormSubmissionDetailDialog({ submission, onOpenChange }: FormSubmissionDetailDialogProps) {
  const payload = (submission?.payload ?? {}) as Record<string, unknown>;
  const payloadEntries = Object.entries(payload);

  return (
    <Dialog open={submission !== null} onOpenChange={(open) => !open && onOpenChange(false)}>
      {/* The base `DialogContent` sets `sm:max-w-sm` — an unprefixed
          override loses that cascade fight at any real screen width, so
          this has to override at the same `sm:` breakpoint to actually
          take effect. */}
      <DialogContent className="sm:max-w-2xl">
        {submission ? (
          <>
            <DialogHeader>
              <DialogTitle>{formTypeLabel(submission.formType)}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <FormSubmissionStatusBadge status={submission.status} />
                {isIncompleteSubmission(submission) ? (
                  <span className="text-xs font-medium text-muted-foreground">
                    Never completed the contact step
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-md border p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{formatValue(submission.name)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{formatValue(submission.email)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{formatValue(submission.phone)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="font-medium text-foreground">{dateFormatter.format(new Date(submission.createdAt))}</p>
                </div>
              </div>

              {payloadEntries.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Submitted details
                  </p>
                  <div className="space-y-2 rounded-md border p-3">
                    {payloadEntries.map(([key, value]) => (
                      <div key={key} className="flex items-start justify-between gap-4 text-sm">
                        <span className="shrink-0 text-muted-foreground">{humanizeKey(key)}</span>
                        <span className="min-w-0 flex-1 text-right font-medium break-words text-foreground">
                          {formatValue(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <p className="text-xs text-muted-foreground">
                {submission.ipAddress ? `IP ${submission.ipAddress}` : null}
                {submission.updatedAt.toString() !== submission.createdAt.toString()
                  ? ` · Updated ${dateFormatter.format(new Date(submission.updatedAt))}`
                  : null}
              </p>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
