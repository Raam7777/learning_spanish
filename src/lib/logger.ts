type LogContext = Readonly<Record<string, unknown>>;
type Level = "info" | "warn" | "error";

const write = (level: Level) => (message: string, context: LogContext) => {
  const line = JSON.stringify({ level, message, ...context, time: new Date().toISOString() });
  return level === "error" ? console.error(line) : level === "warn" ? console.warn(line) : console.log(line);
};

export const logger = {
  info: write("info"),
  warn: write("warn"),
  error: write("error"),
};
