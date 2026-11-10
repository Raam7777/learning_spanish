"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent, type KeyboardEvent } from "react";
import { EntryCard } from "@/components/entry-card";
import { ErrorBanner } from "@/components/error-banner";
import { SendIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { useSpeech } from "@/components/speech-provider";
import { useEntryActions } from "@/components/use-entry-actions";
import { ApiError, fetchEntries, fetchUsage, translate } from "@/lib/client/api";
import type { EntryDto } from "@/lib/entries/dto";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { MAX_INPUT_LENGTH } from "@/lib/translation/schema";

const RECENT_COUNT = 6;

const errorMessage = (error: unknown, t: Dictionary): string =>
  error instanceof ApiError && error.code === "daily_limit"
    ? t.errorDailyLimit
    : error instanceof ApiError && error.code === "translation_failed"
      ? t.errorTranslation
      : t.errorGeneric;

export function TranslateView() {
  const { t } = useI18n();
  const { argentineVoice, supported } = useSpeech();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entries, setEntries] = useState<readonly EntryDto[]>([]);
  const [latestId, setLatestId] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const { toggleStar, remove, setTopic } = useEntryActions(setEntries, setError);

  useEffect(() => {
    fetchEntries({ limit: RECENT_COUNT })
      .then((page) => setEntries(page.data))
      .catch(() => setError(t.errorGeneric));
    fetchUsage()
      .then((usage) => setRemaining(usage.remaining))
      .catch(() => undefined);
  }, [t.errorGeneric]);

  const submit = useCallback(async () => {
    const value = text.trim();
    if (!value || busy) return;
    setBusy(true);
    setError(null);
    try {
      const created = await translate(value);
      setEntries((current) => [created, ...current].slice(0, RECENT_COUNT));
      setLatestId(created.id);
      setRemaining((current) => (current === null ? current : Math.max(0, current - 1)));
      setText("");
    } catch (err) {
      setError(errorMessage(err, t));
    } finally {
      setBusy(false);
    }
  }, [text, busy, t]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void submit();
    }
  };

  const latest = entries.find((entry) => entry.id === latestId);
  const rest = entries.filter((entry) => entry.id !== latestId);

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="spanish text-3xl font-bold text-ink">¡Hola, che!</h1>
        <p className="text-ink-soft">{t.tagline}</p>
        {remaining !== null && (
          <p className="text-sm text-ink-soft tabular-nums">
            {t.quotaRemaining} {remaining} {t.quotaUnit}
          </p>
        )}
      </section>

      <form onSubmit={onSubmit} className="card notebook-margin space-y-3 p-4 ps-8">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.translatePlaceholder}
          maxLength={MAX_INPUT_LENGTH}
          rows={3}
          dir="auto"
          enterKeyHint="send"
          className="w-full resize-none bg-transparent text-lg leading-8 text-ink placeholder:text-ink-soft/70 focus:outline-none"
          aria-label={t.translatePlaceholder}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-ink-soft tabular-nums">
            {text.length}/{MAX_INPUT_LENGTH}
          </span>
          <button type="submit" className="btn btn-primary" disabled={busy || !text.trim()}>
            {busy ? t.translating : t.translateButton}
            {!busy && <SendIcon className="rtl:-scale-x-100" />}
          </button>
        </div>
      </form>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      {latest && <EntryCard entry={latest} highlight onToggleStar={toggleStar} onDelete={remove} onSetTopic={setTopic} />}

      {supported && !argentineVoice && latest && <p className="text-xs text-ink-soft">{t.voiceHint}</p>}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">{t.recent}</h2>
          {rest.length > 0 && (
            <Link href="/history" className="text-sm font-medium text-terracotta hover:underline">
              {t.seeAll}
            </Link>
          )}
        </div>
        {rest.length === 0 && !latest ? (
          <p className="card px-4 py-6 text-center text-ink-soft">{t.emptyRecent}</p>
        ) : (
          <div className="space-y-3">
            {rest.map((entry) => (
              <EntryCard key={entry.id} entry={entry} expanded={false} onToggleStar={toggleStar} onDelete={remove} onSetTopic={setTopic} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
