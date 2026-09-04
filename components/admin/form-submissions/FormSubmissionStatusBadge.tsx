import type { FormSubmissionStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<
  FormSubmissionStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive" }
> = {
  PENDING: { label: "Pending", variant: "secondary" },
  PROCESSED: { label: "Processed", variant: "default" },
  SPAM: { label: "Spam", variant: "destructive" },
  ARCHIVED: { label: "Archived", variant: "outline" },
};

export function FormSubmissionStatusBadge({ status }: { status: FormSubmissionStatus }) {
  const { label, variant } = STATUS_CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
