import "server-only";

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: unknown;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function isLogLevel(value: string | undefined): value is LogLevel {
  return value !== undefined && value in LEVEL_PRIORITY;
}

function currentLevel(): LogLevel {
  const configured = process.env.LOG_LEVEL;
  if (isLogLevel(configured)) return configured;
  return process.env.NODE_ENV === "production" ? "info" : "debug";
}

function write(level: LogLevel, message: string, context?: LogContext): void {
  if (LEVEL_PRIORITY[level] < LEVEL_PRIORITY[currentLevel()]) return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(context ? { context } : {}),
  };
  const line = JSON.stringify(entry);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

/**
 * Minimal structured logger. Server-only (guarded via the `server-only`
 * package) so it can never end up in a client bundle. Emits one JSON line
 * per call — swap `write()`'s body for a provider (Pino, Datadog, etc.)
 * later without touching call sites.
 */
export const logger = {
  debug: (message: string, context?: LogContext) => write("debug", message, context),
  info: (message: string, context?: LogContext) => write("info", message, context),
  warn: (message: string, context?: LogContext) => write("warn", message, context),
  error: (message: string, context?: LogContext) => write("error", message, context),
};
