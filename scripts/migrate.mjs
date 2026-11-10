import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({ path: ".env.local", override: true });

const databaseUrl = process.env.DATABASE_URL ?? "";

if (!databaseUrl.startsWith("postgresql://") || databaseUrl.includes("@host/")) {
  console.error("DATABASE_URL in .env.local is still the placeholder. Paste the Neon connection string into that file.");
  process.exit(1);
}

const redact = (text) => text.replace(/postgres(?:ql)?:\/\/\S+/gi, "postgresql://***");

const describe = (error) => {
  const current = error instanceof Error ? error : new Error(String(error));
  const cause = current.cause instanceof Error ? current.cause.message : "";
  return redact([current.message, cause].filter(Boolean).join("\n"));
};

try {
  await migrate(drizzle(neon(databaseUrl)), { migrationsFolder: "drizzle" });
  console.log("migrations applied");
} catch (error) {
  console.error(describe(error));
  process.exit(1);
}
