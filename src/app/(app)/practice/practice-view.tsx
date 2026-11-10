"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { ErrorBanner } from "@/components/error-banner";
import { CardsIcon, StarIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { TopicChips } from "@/components/topic-chips";
import { fetchPracticeCards, type PracticePool } from "@/lib/client/api";
import type { PracticeCard } from "@/lib/practice/cards";
import type { Topic } from "@/lib/topics";
import { FlipSession } from "./flip-session";
import { SpeakSession, canSpeak } from "./speak-session";
import { TypeSession } from "./type-session";

type Mode = "flip" | "type" | "listen" | "speak";
type Session = Readonly<{ cards: readonly PracticeCard[]; mode: Mode; round: number }>;

const POOLS: readonly PracticePool[] = ["due", "starter", "all", "starred"];

const subscribeNothing = (): (() => void) => () => undefined;

const formatWhen = (iso: string, lang: string): string =>
  new Intl.DateTimeFormat(lang === "he" ? "he-IL" : "en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

export function PracticeView() {
  const { t, lang } = useI18n();
  const speaking = useSyncExternalStore(subscribeNothing, canSpeak, () => false);
  const [pool, setPool] = useState<PracticePool>("due");
  const [topic, setTopic] = useState<Topic | null>(null);
  const [mode, setMode] = useState<Mode>("flip");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState<PracticePool | null>(null);
  const [nextDueAt, setNextDueAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setLoading(true);
    setError(null);
    setEmpty(null);
    setNextDueAt(null);
    try {
      const result = await fetchPracticeCards(pool, topic ?? undefined);
      if (result.data.length === 0) {
        setEmpty(pool);
        setNextDueAt(result.nextDueAt);
        return;
      }
      setSession((current) => ({ cards: result.data, mode, round: (current?.round ?? 0) + 1 }));
    } catch {
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const exit = () => setSession(null);

  if (session) {
    const shared = { cards: session.cards, onRestart: start, onExit: exit };
    if (session.mode === "flip") return <FlipSession key={session.round} {...shared} />;
    if (session.mode === "speak") return <SpeakSession key={session.round} {...shared} />;
    return <TypeSession key={session.round} {...shared} prompt={session.mode === "listen" ? "audio" : "source"} />;
  }

  const poolLabel = (value: PracticePool): string =>
    value === "due" ? t.practicePoolDue : value === "starter" ? t.practicePoolStarter : value === "starred" ? t.filterStarred : t.filterAll;

  const emptyText =
    empty === "starred" ? t.practiceEmptyStarred : empty === "starter" ? t.practiceEmptyStarter : empty === "due" ? t.practiceEmptyDue : t.practiceEmpty;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ink">{t.practiceTitle}</h1>

      <section className="card space-y-5 p-5">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-ink-soft">{t.practicePool}</h2>
          <div className="flex flex-wrap gap-2">
            {POOLS.map((value) => (
              <button key={value} type="button" className="chip" aria-pressed={pool === value} onClick={() => setPool(value)}>
                {value === "starred" && <StarIcon width={16} height={16} filled={pool === "starred"} />}
                {poolLabel(value)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-ink-soft">{t.topicLabel}</h2>
          <TopicChips value={topic} onChange={setTopic} allowAll />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["flip", "🃏", t.practiceModeFlip],
              ["type", "⌨️", t.practiceModeType],
              ["listen", "🎧", t.practiceModeListen],
              ["speak", "🎤", t.practiceModeSpeak],
            ] as const
          ).map(([value, icon, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              aria-pressed={mode === value}
              disabled={value === "speak" && !speaking}
              className={`rounded-2xl border-2 p-4 text-start transition disabled:opacity-50 ${mode === value ? "border-terracotta bg-terracotta-soft" : "border-line bg-card hover:bg-paper-deep"}`}
            >
              <span className="mb-2 block text-2xl">{icon}</span>
              <span className="font-semibold text-ink">{label}</span>
            </button>
          ))}
        </div>
        {!speaking && <p className="text-sm text-ink-soft">{t.speakUnsupported}</p>}

        <button type="button" className="btn btn-primary w-full" onClick={() => void start()} disabled={loading || (mode === "speak" && !speaking)}>
          <CardsIcon />
          {loading ? t.loading : t.practiceStart}
        </button>
      </section>

      {empty && (
        <div className="card space-y-3 px-4 py-6 text-center">
          <p className="text-ink-soft">{emptyText}</p>
          {nextDueAt && (
            <p className="text-sm text-ink-soft">
              {t.nextDue} {formatWhen(nextDueAt, lang)}
            </p>
          )}
          {empty !== "starter" && (
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" className="btn btn-primary" onClick={() => setPool("starter")}>
                {t.practiceUseStarter}
              </button>
              <Link href="/" className="btn btn-ghost">
                {t.practiceGoTranslate}
              </Link>
            </div>
          )}
        </div>
      )}

      <ErrorBanner message={error} onClose={() => setError(null)} />
    </div>
  );
}
