"use client";

import { useState } from "react";
import { ErrorBanner } from "@/components/error-banner";
import { CardsIcon, StarIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { fetchPracticeCards } from "@/lib/client/api";
import type { EntryDto } from "@/lib/entries/dto";
import { FlipSession } from "./flip-session";
import { TypeSession } from "./type-session";

type Pool = "all" | "starred";
type Mode = "flip" | "type";
type Session = Readonly<{ cards: readonly EntryDto[]; mode: Mode; round: number }>;

export function PracticeView() {
  const { t } = useI18n();
  const [pool, setPool] = useState<Pool>("all");
  const [mode, setMode] = useState<Mode>("flip");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState<Pool | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setLoading(true);
    setError(null);
    setEmpty(null);
    try {
      const { data } = await fetchPracticeCards(pool);
      if (data.length === 0) {
        setEmpty(pool);
        return;
      }
      setSession((current) => ({ cards: data, mode, round: (current?.round ?? 0) + 1 }));
    } catch {
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const exit = () => setSession(null);

  if (session) {
    const Runner = session.mode === "flip" ? FlipSession : TypeSession;
    return <Runner key={session.round} cards={session.cards} onRestart={start} onExit={exit} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-ink">{t.practiceTitle}</h1>

      <section className="card space-y-5 p-5">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-ink-soft">{t.practicePool}</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="chip" aria-pressed={pool === "all"} onClick={() => setPool("all")}>
              {t.filterAll}
            </button>
            <button type="button" className="chip" aria-pressed={pool === "starred"} onClick={() => setPool("starred")}>
              <StarIcon width={16} height={16} filled={pool === "starred"} />
              {t.filterStarred}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {(["flip", "type"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              aria-pressed={mode === value}
              className={`rounded-2xl border-2 p-4 text-start transition ${mode === value ? "border-terracotta bg-terracotta-soft" : "border-line bg-card hover:bg-paper-deep"}`}
            >
              <span className="mb-2 block text-2xl">{value === "flip" ? "🃏" : "⌨️"}</span>
              <span className="font-semibold text-ink">{value === "flip" ? t.practiceModeFlip : t.practiceModeType}</span>
            </button>
          ))}
        </div>

        <button type="button" className="btn btn-primary w-full" onClick={() => void start()} disabled={loading}>
          <CardsIcon />
          {loading ? t.loading : t.practiceStart}
        </button>
      </section>

      {empty && (
        <p className="card px-4 py-6 text-center text-ink-soft">
          {empty === "starred" ? t.practiceEmptyStarred : t.practiceEmpty}
        </p>
      )}

      <ErrorBanner message={error} onClose={() => setError(null)} />
    </div>
  );
}
