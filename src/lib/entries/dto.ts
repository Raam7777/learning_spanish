import * as z from "zod";
import type { Entry } from "@/db/schema";
import type { BreakdownItem, SourceLanguage } from "@/lib/translation/types";

export type EntryDto = Readonly<{
  id: string;
  sourceText: string;
  sourceLanguage: SourceLanguage;
  spanish: string;
  breakdown: readonly BreakdownItem[];
  note: string | null;
  starred: boolean;
  createdAt: string;
}>;

export const toEntryDto = (row: Entry): EntryDto => ({
  id: row.id,
  sourceText: row.sourceText,
  sourceLanguage: row.sourceLanguage,
  spanish: row.spanish,
  breakdown: row.breakdown,
  note: row.note,
  starred: row.starred,
  createdAt: row.createdAt.toISOString(),
});

export const listQuerySchema = z.object({
  q: z.string().trim().max(200).optional(),
  starred: z.enum(["1", "0"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const practiceQuerySchema = z.object({
  pool: z.enum(["all", "starred"]).default("all"),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const updateEntrySchema = z.object({
  starred: z.boolean(),
});

export const entryIdSchema = z.uuid();

export const searchParamsObject = (request: Request): Record<string, string> =>
  Object.fromEntries(new URL(request.url).searchParams);
