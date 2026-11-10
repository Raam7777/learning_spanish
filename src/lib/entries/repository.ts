import { and, count, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { entry, type Entry } from "@/db/schema";
import type { Translation } from "@/lib/translation/types";

export type EntryFilter = Readonly<{
  userId: string;
  query?: string;
  starredOnly?: boolean;
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

const filterCondition = ({ userId, query, starredOnly }: EntryFilter): SQL | undefined =>
  and(
    eq(entry.userId, userId),
    query ? searchCondition(query) : undefined,
    starredOnly ? eq(entry.starred, true) : undefined,
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

export const setEntryStarred = async (userId: string, id: string, starred: boolean): Promise<Entry | null> => {
  const [updated] = await getDb().update(entry).set({ starred }).where(ownedEntry(userId, id)).returning();
  return updated ?? null;
};

export const deleteEntry = async (userId: string, id: string): Promise<boolean> => {
  const deleted = await getDb().delete(entry).where(ownedEntry(userId, id)).returning({ id: entry.id });
  return deleted.length > 0;
};
