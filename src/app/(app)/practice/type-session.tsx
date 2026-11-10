"use client";

import { useState, type FormEvent } from "react";
import { ErrorBanner } from "@/components/error-banner";
import { useI18n } from "@/components/i18n-provider";
import { ListenButtons } from "@/components/listen-buttons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { accentPieces } from "@/lib/practice/accents";
import { compareAnswer, type AnswerResult } from "@/lib/practice/compare";
import type { PracticeCard } from "@/lib/practice/cards";
import { SessionHeader, SessionSummary, SourceText, type SessionProps } from "./session-chrome";
import { useRound } from "./use-round";

const RESULT_STYLE: Readonly<Record<AnswerResult, string>> = {
  correct: "bg-olive-soft text-olive",
  accents: "bg-sun/20 text-ink",
  wrong: "bg-terracotta-soft text-terracotta-dark",
};

const resultText = (result: AnswerResult, t: Dictionary): string =>
  result === "correct" ? t.resultCorrect : result === "accents" ? t.resultAccents : t.resultWrong;

type Prompt = "source" | "audio";

type CardProps = Readonly<{
  card: PracticeCard;
  index: number;
  total: number;
  prompt: Prompt;
  willReturn: boolean;
  onGrade: (result: AnswerResult) => void;
  onExit: () => void;
}>;

function TypeCard({ card, index, total, prompt, willReturn, onGrade, onExit }: CardProps) {
  const { t } = useI18n();
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (result) {
      onGrade(result);
      return;
    }
    if (!answer.trim()) return;
    setResult(compareAnswer(answer, card.spanish));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <SessionHeader index={index} total={total} onExit={onExit} />

      <div className={`card flex flex-col items-center justify-center gap-4 p-6 ${result ? "min-h-24" : "min-h-40"}`}>
        {prompt === "audio" ? (
          <>
            <p className="text-center text-sm text-ink-soft">{t.listenPrompt}</p>
            <ListenButtons speechKey={`listen:${card.id}:${index}`} text={card.spanish} size="lg" />
          </>
        ) : (
          <SourceText>{card.sourceText}</SourceText>
        )}
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
            {result === "accents"
              ? accentPieces(answer, card.spanish).map((piece, pieceIndex) =>
                  piece.missing ? (
                    <mark key={pieceIndex} className="rounded bg-sun/70 px-0.5 text-ink">
                      {piece.text}
                    </mark>
                  ) : (
                    <span key={pieceIndex}>{piece.text}</span>
                  ),
                )
              : card.spanish}
          </p>
          {prompt === "audio" && <p className="text-sm text-ink-soft">{card.sourceText}</p>}
          {result !== "correct" && willReturn && <p className="text-sm">{t.retryHint}</p>}
          <ListenButtons speechKey={`practice:${card.id}:${index}`} text={card.spanish} />
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] z-10 w-full"
        disabled={!result && !answer.trim()}
      >
        {result ? t.next : t.check}
      </button>
    </form>
  );
}

export function TypeSession({ cards, onRestart, onExit, prompt = "source" }: SessionProps & { prompt?: Prompt }) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const round = useRound(cards, () => setError(t.errorGeneric));

  if (round.finished || !round.card) {
    return <SessionSummary known={round.known} total={round.originalTotal} onRestart={onRestart} onExit={onExit} />;
  }

  return (
    <div className="space-y-4">
      <ErrorBanner message={error} onClose={() => setError(null)} />
      <TypeCard
        key={`${round.card.id}:${round.index}`}
        card={round.card}
        index={round.index}
        total={round.total}
        prompt={prompt}
        willReturn={round.willReturn}
        onGrade={round.grade}
        onExit={onExit}
      />
    </div>
  );
}
