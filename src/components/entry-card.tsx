"use client";

import { StarIcon, TrashIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { ListenButtons } from "@/components/listen-buttons";
import { NoteTranslation } from "@/components/note-translation";
import { useSpeech } from "@/components/speech-provider";
import type { EntryDto } from "@/lib/entries/dto";

type Props = Readonly<{
  entry: EntryDto;
  expanded?: boolean;
  highlight?: boolean;
  onToggleStar: (entry: EntryDto) => void;
  onDelete: (entry: EntryDto) => void;
}>;

const formatDate = (iso: string, lang: string): string =>
  new Intl.DateTimeFormat(lang === "he" ? "he-IL" : "en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

function Breakdown({ entry }: { entry: EntryDto }) {
  const { speak } = useSpeech();
  return (
    <ul className="flex flex-wrap gap-2" dir="ltr">
      {entry.breakdown.map((item, index) => (
        <li key={`${item.spanish}-${index}`}>
          <button
            type="button"
            onClick={() => speak(`${entry.id}:part:${index}`, item.spanish)}
            className="flex flex-col items-center rounded-xl border border-line bg-paper px-3 py-1.5 transition hover:border-celeste hover:bg-celeste-soft"
          >
            <span className="spanish text-base font-semibold text-ink">{item.spanish}</span>
            <span className="text-xs text-ink-soft" dir="auto">
              {item.meaning}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function EntryCard({ entry, expanded = true, highlight = false, onToggleStar, onDelete }: Props) {
  const { t, lang } = useI18n();

  return (
    <article className={`card animate-rise overflow-hidden ${highlight ? "ring-2 ring-terracotta/40" : ""}`}>
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <p className="text-sm text-ink-soft" dir="auto">
          {entry.sourceText}
        </p>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleStar(entry)}
            className={`grid size-10 place-items-center rounded-full transition hover:bg-paper-deep ${entry.starred ? "text-sun" : "text-ink-soft"}`}
            aria-label={entry.starred ? t.unstar : t.star}
            aria-pressed={entry.starred}
          >
            <StarIcon filled={entry.starred} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(entry)}
            className="grid size-10 place-items-center rounded-full text-ink-soft transition hover:bg-terracotta-soft hover:text-terracotta"
            aria-label={t.delete}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <p className="spanish px-4 pt-1 text-2xl leading-snug font-semibold text-ink sm:text-3xl" dir="ltr" lang="es-AR">
        {entry.spanish}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3 pb-4">
        <ListenButtons speechKey={entry.id} text={entry.spanish} />
        <time className="text-xs text-ink-soft" dateTime={entry.createdAt}>
          {formatDate(entry.createdAt, lang)}
        </time>
      </div>

      {expanded && (entry.breakdown.length > 1 || entry.note) && (
        <div className="space-y-3 border-t border-dashed border-line bg-paper/60 px-4 py-4">
          {entry.breakdown.length > 1 && (
            <section className="space-y-2">
              <h3 className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{t.breakdown}</h3>
              <Breakdown entry={entry} />
            </section>
          )}
          {entry.note && <NoteTranslation note={entry.note} />}
        </div>
      )}
    </article>
  );
}
