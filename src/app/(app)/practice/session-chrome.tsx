"use client";

import type { ReactNode } from "react";
import { XIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import type { PracticeCard } from "@/lib/practice/cards";

type HeaderProps = Readonly<{ index: number; total: number; onExit: () => void }>;

export function SessionHeader({ index, total, onExit }: HeaderProps) {
  const { t } = useI18n();
  const progress = Math.round((index / total) * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-soft tabular-nums">
          {index + 1} {t.cardOf} {total}
        </span>
        <button type="button" onClick={onExit} className="grid size-10 place-items-center rounded-full text-ink-soft hover:bg-paper-deep" aria-label="Exit">
          <XIcon />
        </button>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-paper-deep">
        <div className="h-full rounded-full bg-terracotta transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

type SummaryProps = Readonly<{ known: number; total: number; onRestart: () => void; onExit: () => void }>;

export function SessionSummary({ known, total, onRestart, onExit }: SummaryProps) {
  const { t } = useI18n();
  return (
    <div className="card animate-rise space-y-5 p-6 text-center">
      <p className="text-5xl">🧉</p>
      <h2 className="text-2xl font-bold text-ink">{t.practiceDone}</h2>
      <p className="text-lg text-ink-soft">
        {t.practiceScore}{" "}
        <span className="font-bold text-terracotta tabular-nums">
          {known}/{total}
        </span>
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" className="btn btn-primary" onClick={onRestart}>
          {t.practiceAgain}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          {t.practiceTitle}
        </button>
      </div>
    </div>
  );
}

export function SourceText({ children }: { children: ReactNode }) {
  return (
    <p className="text-center text-2xl leading-relaxed font-semibold text-ink" dir="auto">
      {children}
    </p>
  );
}

export type SessionProps = Readonly<{
  cards: readonly PracticeCard[];
  onRestart: () => void;
  onExit: () => void;
}>;
