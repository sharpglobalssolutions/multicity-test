import { apiSuccess } from "@/lib/api-response";
import { DatabaseError } from "@/lib/errors";
import { handleApiError } from "@/lib/handle-error";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

// This route checks a live database connection on every request, so it
// must never be statically optimized/cached at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return apiSuccess({ status: "ok", database: "connected" });
  } catch (error) {
    logger.error("Health check failed: database unreachable", {
      error: error instanceof Error ? error.message : String(error),
    });
    return handleApiError(new DatabaseError("Database connection failed"));
  }
}
