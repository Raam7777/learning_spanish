import type { Entry } from "@/db/schema";
import { toEntryDto, type EntryDto } from "@/lib/entries/dto";
import type { Lang } from "@/lib/i18n/dictionary";
import type { ReviewState } from "@/lib/practice/schedule";
import { starterNote, starterPrompt, type StarterCard } from "@/lib/practice/starter";

export type CardKind = "entry" | "starter";

export type PracticeCard = EntryDto & Readonly<{ kind: CardKind }>;

export const toEntryCard = (row: Entry): PracticeCard => ({ ...toEntryDto(row), kind: "entry" });

export const toStarterCard = (card: StarterCard, lang: Lang, review: ReviewState | null, now: Date): PracticeCard => {
  const sourceText = starterPrompt(card, lang);
  const dueAt = review?.dueAt ?? now;
  return {
    id: card.id,
    kind: "starter",
    sourceText,
    sourceLanguage: lang,
    spanish: card.es,
    breakdown: [{ spanish: card.es, meaning: sourceText }],
    note: starterNote(card, lang),
    starred: false,
    topic: card.topic,
    dueAt: dueAt.toISOString(),
    repetitions: review?.repetitions ?? 0,
    createdAt: dueAt.toISOString(),
  };
};
