"use client";

import { useState } from "react";
import { reviewCard } from "@/lib/client/api";
import type { PracticeCard } from "@/lib/practice/cards";
import type { Grade } from "@/lib/practice/schedule";

export const useRound = (cards: readonly PracticeCard[], onError: () => void) => {
  const [queue, setQueue] = useState<readonly PracticeCard[]>(cards);
  const [index, setIndex] = useState(0);
  const [known, setKnown] = useState(0);
  const [retried, setRetried] = useState<ReadonlySet<string>>(() => new Set());

  const card = queue[index];
  const finished = index >= queue.length;

  const grade = (result: Grade) => {
    if (!card) return;
    const firstTry = !retried.has(card.id);
    if (firstTry && result !== "wrong") setKnown((value) => value + 1);
    void reviewCard(card.kind, card.id, result).catch(() => onError());
    if (result !== "correct" && firstTry) {
      setRetried((current) => new Set(current).add(card.id));
      setQueue((current) => [...current, card]);
    }
    setIndex((value) => value + 1);
  };

  return {
    card,
    index,
    total: queue.length,
    known,
    finished,
    grade,
    willReturn: Boolean(card && !retried.has(card.id)),
    originalTotal: cards.length,
  };
};
