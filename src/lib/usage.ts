import { and, count, eq, gte } from "drizzle-orm";
import { getDb } from "@/db";
import { aiCall, entry } from "@/db/schema";
import { optionalEnv } from "@/lib/env";

export type AiKind = "note" | "tutor";

const startOfUtcDay = (now: Date): Date => new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

export const dailyLimit = (): number => Number(optionalEnv("DAILY_TRANSLATION_LIMIT", "100"));

const countEntriesSince = async (userId: string, since: Date): Promise<number> => {
  const [row] = await getDb()
    .select({ value: count() })
    .from(entry)
    .where(and(eq(entry.userId, userId), gte(entry.createdAt, since)));
  return row?.value ?? 0;
};

const countAiCallsSince = async (userId: string, since: Date): Promise<number> => {
  const [row] = await getDb()
    .select({ value: count() })
    .from(aiCall)
    .where(and(eq(aiCall.userId, userId), gte(aiCall.createdAt, since)));
  return row?.value ?? 0;
};

export const countUsageToday = async (userId: string): Promise<number> => {
  const since = startOfUtcDay(new Date());
  const [translations, calls] = await Promise.all([countEntriesSince(userId, since), countAiCallsSince(userId, since)]);
  return translations + calls;
};

export const recordAiCall = async (userId: string, kind: AiKind): Promise<void> => {
  await getDb().insert(aiCall).values({ userId, kind });
};
