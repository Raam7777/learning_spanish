import { and, asc, count, desc, eq, gt, ilike, lte, or, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { entry, starterReview, type Entry } from "@/db/schema";
import type { ReviewState } from "@/lib/practice/schedule";
import type { Topic } from "@/lib/topics";
import type { SourceLanguage, Translation } from "@/lib/translation/types";

export type EntryFilter = Readonly<{
  userId: string;
  query?: string;
  starredOnly?: boolean;
  topic?: Topic;
}>;

export type EntryPatch = Readonly<{
  starred?: boolean;
  topic?: Topic | null;
}>;

export type Page<T> = Readonly<{
  data: readonly T[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}>;

const escapeLike = (value: string): string => value.replace(/[\\%_]/g, (char) => `\\${char}`);

const searchCondition = (query: string): SQL | undefined => {
  const pattern = `%${escapeLike(query)}%`;
  return or(ilike(entry.sourceText, pattern), ilike(entry.spanish, pattern));
};

const filterCondition = ({ userId, query, starredOnly, topic }: EntryFilter): SQL | undefined =>
  and(
    eq(entry.userId, userId),
    query ? searchCondition(query) : undefined,
    starredOnly ? eq(entry.starred, true) : undefined,
    topic ? eq(entry.topic, topic) : undefined,
  );

const ownedEntry = (userId: string, id: string): SQL | undefined => and(eq(entry.id, id), eq(entry.userId, userId));

export const createEntry = async (userId: string, sourceText: string, translation: Translation): Promise<Entry> => {
  const [created] = await getDb()
    .insert(entry)
    .values({ userId, sourceText, ...translation })
    .returning();
  return created;
};

export const listEntries = async (filter: EntryFilter, page: number, limit: number): Promise<Page<Entry>> => {
  const where = filterCondition(filter);
  const [data, [totalRow]] = await Promise.all([
    getDb()
      .select()
      .from(entry)
      .where(where)
      .orderBy(desc(entry.createdAt))
      .limit(limit)
      .offset((page - 1) * limit),
    getDb().select({ value: count() }).from(entry).where(where),
  ]);
  const total = totalRow?.value ?? 0;
  return { data, total, limit, page, pages: Math.max(1, Math.ceil(total / limit)) };
};

export const randomEntries = async (filter: EntryFilter, limit: number): Promise<readonly Entry[]> =>
  getDb().select().from(entry).where(filterCondition(filter)).orderBy(sql`random()`).limit(limit);

export const dueEntries = async (filter: EntryFilter, limit: number, now: Date): Promise<readonly Entry[]> =>
  getDb()
    .select()
    .from(entry)
    .where(and(filterCondition(filter), lte(entry.dueAt, now)))
    .orderBy(asc(entry.dueAt))
    .limit(limit);

export const nextEntryDueAt = async (userId: string, now: Date): Promise<Date | null> => {
  const [row] = await getDb()
    .select({ dueAt: entry.dueAt })
    .from(entry)
    .where(and(eq(entry.userId, userId), gt(entry.dueAt, now)))
    .orderBy(asc(entry.dueAt))
    .limit(1);
  return row?.dueAt ?? null;
};

export const entryReviewState = async (userId: string, id: string): Promise<ReviewState | null> => {
  const [row] = await getDb()
    .select({
      ease: entry.ease,
      intervalDays: entry.intervalDays,
      repetitions: entry.repetitions,
      dueAt: entry.dueAt,
    })
    .from(entry)
    .where(ownedEntry(userId, id));
  return row ?? null;
};

export const saveEntryReview = async (userId: string, id: string, state: ReviewState): Promise<boolean> => {
  const updated = await getDb()
    .update(entry)
    .set({
      ease: state.ease,
      intervalDays: state.intervalDays,
      repetitions: state.repetitions,
      dueAt: state.dueAt,
    })
    .where(ownedEntry(userId, id))
    .returning({ id: entry.id });
  return updated.length > 0;
};

export const listStarterReviews = async (userId: string): Promise<readonly (ReviewState & { cardId: string })[]> =>
  getDb()
    .select({
      cardId: starterReview.cardId,
      ease: starterReview.ease,
      intervalDays: starterReview.intervalDays,
      repetitions: starterReview.repetitions,
      dueAt: starterReview.dueAt,
    })
    .from(starterReview)
    .where(eq(starterReview.userId, userId));

export const starterReviewState = async (userId: string, cardId: string): Promise<ReviewState | null> => {
  const [row] = await getDb()
    .select({
      ease: starterReview.ease,
      intervalDays: starterReview.intervalDays,
      repetitions: starterReview.repetitions,
      dueAt: starterReview.dueAt,
    })
    .from(starterReview)
    .where(and(eq(starterReview.userId, userId), eq(starterReview.cardId, cardId)));
  return row ?? null;
};

export const saveStarterReview = async (userId: string, cardId: string, state: ReviewState): Promise<void> => {
  await getDb()
    .insert(starterReview)
    .values({ userId, cardId, ...state })
    .onConflictDoUpdate({
      target: [starterReview.userId, starterReview.cardId],
      set: {
        ease: state.ease,
        intervalDays: state.intervalDays,
        repetitions: state.repetitions,
        dueAt: state.dueAt,
      },
    });
};

export const updateOwnedEntry = async (userId: string, id: string, patch: EntryPatch): Promise<Entry | null> => {
  const [updated] = await getDb().update(entry).set(patch).where(ownedEntry(userId, id)).returning();
  return updated ?? null;
};

type LessonExample = Readonly<{ es: string; he: string; en: string }>;

export const importLessonExamples = async (
  userId: string,
  lang: SourceLanguage,
  examples: readonly LessonExample[],
): Promise<number> => {
  const existing = await getDb()
    .select({ sourceText: entry.sourceText, spanish: entry.spanish })
    .from(entry)
    .where(eq(entry.userId, userId));
  const known = new Set(existing.map((row) => `${row.sourceText}\0${row.spanish}`));
  const fresh = examples
    .map((example) => ({
      userId,
      sourceText: example[lang],
      sourceLanguage: lang,
      spanish: example.es,
      breakdown: [{ spanish: example.es, meaning: example[lang] }],
      note: null,
      topic: "grammar" as const,
    }))
    .filter((row) => !known.has(`${row.sourceText}\0${row.spanish}`));
  if (fresh.length === 0) return 0;
  await getDb().insert(entry).values([...fresh]);
  return fresh.length;
};

export const deleteEntry = async (userId: string, id: string): Promise<boolean> => {
  const deleted = await getDb().delete(entry).where(ownedEntry(userId, id)).returning({ id: entry.id });
  return deleted.length > 0;
};
