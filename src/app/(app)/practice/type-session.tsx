"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ListenButtons } from "@/components/listen-buttons";
import { compareAnswer, type AnswerResult } from "@/lib/practice/compare";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { SessionHeader, SessionSummary, SourceText, type SessionProps } from "./session-chrome";

const RESULT_STYLE: Readonly<Record<AnswerResult, string>> = {
  correct: "bg-olive-soft text-olive",
  accents: "bg-sun/20 text-ink",
  wrong: "bg-terracotta-soft text-terracotta-dark",
};

const resultText = (result: AnswerResult, t: Dictionary): string =>
  result === "correct" ? t.resultCorrect : result === "accents" ? t.resultAccents : t.resultWrong;

export function TypeSession({ cards, onRestart, onExit }: SessionProps) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [known, setKnown] = useState(0);

  if (index >= cards.length) {
    return <SessionSummary known={known} total={cards.length} onRestart={onRestart} onExit={onExit} />;
  }

  const card = cards[index];

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (result) {
      setResult(null);
      setAnswer("");
      setIndex((value) => value + 1);
      return;
    }
    if (!answer.trim()) return;
    const outcome = compareAnswer(answer, card.spanish);
    setKnown((value) => value + (outcome === "wrong" ? 0 : 1));
    setResult(outcome);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <SessionHeader index={index} total={cards.length} onExit={onExit} />

      <div className="card flex min-h-40 items-center justify-center p-6">
        <SourceText>{card.sourceText}</SourceText>
      </div>

      <input
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder={t.typeAnswer}
        className="field spanish text-xl"
        dir="ltr"
        lang="es-AR"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        readOnly={result !== null}
        autoFocus
      />

      {result && (
        <div className={`animate-rise space-y-3 rounded-2xl p-4 ${RESULT_STYLE[result]}`}>
          <p className="font-semibold">{resultText(result, t)}</p>
          <p className="spanish text-2xl font-semibold text-ink" dir="ltr" lang="es-AR">
            {card.spanish}
          </p>
          <ListenButtons speechKey={`practice:${card.id}`} text={card.spanish} />
        </div>
      )}

      <button type="submit" className="btn btn-primary w-full" disabled={!result && !answer.trim()}>
        {result ? t.next : t.check}
      </button>
    </form>
  );
}
