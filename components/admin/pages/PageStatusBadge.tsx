import type { ContentStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<ContentStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Published", variant: "default" },
  ARCHIVED: { label: "Archived", variant: "outline" },
};

export function PageStatusBadge({ status }: { status: ContentStatus }) {
  const { label, variant } = STATUS_CONFIG[status];
  return <Badge variant={variant}>{label}</Badge>;
}
