import { dueEntries, listStarterReviews, nextEntryDueAt, randomEntries } from "@/lib/entries/repository";
import type { Lang } from "@/lib/i18n/dictionary";
import { toEntryCard, toStarterCard, type PracticeCard } from "@/lib/practice/cards";
import { STARTER_DECK } from "@/lib/practice/starter";
import type { Topic } from "@/lib/topics";

export type PracticePool = "due" | "all" | "starred" | "starter";

export type PracticeSelection = Readonly<{
  data: readonly PracticeCard[];
  nextDueAt: string | null;
}>;

const earliestAfter = (dates: readonly Date[], now: Date): Date | null =>
  dates.filter((date) => date > now).sort((left, right) => left.getTime() - right.getTime())[0] ?? null;

const selectStarter = async (userId: string, topic: Topic | undefined, limit: number, lang: Lang, now: Date): Promise<PracticeSelection> => {
  const reviews = await listStarterReviews(userId);
  const byId = new Map(reviews.map((review) => [review.cardId, review]));
  const due = STARTER_DECK.filter((card) => !topic || card.topic === topic)
    .map((card) => ({ card, review: byId.get(card.id) ?? null }))
    .filter(({ review }) => !review || review.dueAt <= now)
    .sort((left, right) => (left.review?.dueAt.getTime() ?? 0) - (right.review?.dueAt.getTime() ?? 0))
    .slice(0, limit);
  const next = due.length > 0 ? null : earliestAfter(reviews.map((review) => review.dueAt), now);
  return {
    data: due.map(({ card, review }) => toStarterCard(card, lang, review, now)),
    nextDueAt: next?.toISOString() ?? null,
  };
};

export const selectPractice = async (
  userId: string,
  pool: PracticePool,
  topic: Topic | undefined,
  limit: number,
  lang: Lang,
  now: Date,
): Promise<PracticeSelection> => {
  if (pool === "starter") return selectStarter(userId, topic, limit, lang, now);
  if (pool === "due") {
    const rows = await dueEntries({ userId, topic }, limit, now);
    const next = rows.length > 0 ? null : await nextEntryDueAt(userId, now);
    return { data: rows.map(toEntryCard), nextDueAt: next?.toISOString() ?? null };
  }
  const rows = await randomEntries({ userId, starredOnly: pool === "starred", topic }, limit);
  return { data: rows.map(toEntryCard), nextDueAt: null };
};
