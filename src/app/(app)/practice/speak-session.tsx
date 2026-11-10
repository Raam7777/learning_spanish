"use client";

import { useEffect, useRef, useState } from "react";
import { ErrorBanner } from "@/components/error-banner";
import { useI18n } from "@/components/i18n-provider";
import { ListenButtons } from "@/components/listen-buttons";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { compareAnswer, type AnswerResult } from "@/lib/practice/compare";
import type { PracticeCard } from "@/lib/practice/cards";
import { SessionHeader, SessionSummary, SourceText, type SessionProps } from "./session-chrome";
import { useRound } from "./use-round";

type RecognitionResult = Readonly<{ results: ArrayLike<ArrayLike<{ transcript: string }>> }>;

type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: RecognitionResult) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};

type RecognitionCtor = new () => Recognition;

const recognitionCtor = (): RecognitionCtor | null => {
  if (typeof window === "undefined") return null;
  const host = window as Window & { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
};

export const canSpeak = (): boolean => recognitionCtor() !== null;

const RESULT_STYLE: Readonly<Record<AnswerResult, string>> = {
  correct: "bg-olive-soft text-olive",
  accents: "bg-sun/20 text-ink",
  wrong: "bg-terracotta-soft text-terracotta-dark",
};

const resultText = (result: AnswerResult, t: Dictionary): string =>
  result === "correct" ? t.resultCorrect : result === "accents" ? t.resultAccents : t.resultWrong;

type CardProps = Readonly<{
  card: PracticeCard;
  index: number;
  total: number;
  willReturn: boolean;
  onGrade: (result: AnswerResult) => void;
  onExit: () => void;
  onError: () => void;
}>;

function SpeakCard({ card, index, total, willReturn, onGrade, onExit, onError }: CardProps) {
  const { t } = useI18n();
  const recognitionRef = useRef<Recognition | null>(null);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const start = () => {
    const Ctor = recognitionCtor();
    if (!Ctor) return;
    recognitionRef.current?.abort();
    const recognition = new Ctor();
    recognitionRef.current = recognition;
    recognition.lang = "es-AR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setHeard(transcript);
      setResult(compareAnswer(transcript, card.spanish));
    };
    recognition.onerror = () => onError();
    recognition.onend = () => setListening(false);
    setListening(true);
    setHeard(null);
    setResult(null);
    try {
      recognition.start();
    } catch {
      setListening(false);
      onError();
    }
  };

  return (
    <div className="space-y-5">
      <SessionHeader index={index} total={total} onExit={onExit} />
      <div className="card flex min-h-40 flex-col items-center justify-center gap-3 p-6">
        <p className="text-sm text-ink-soft">{t.speakPrompt}</p>
        <SourceText>{card.sourceText}</SourceText>
        <p className="spanish text-center text-2xl font-semibold text-ink" dir="ltr" lang="es-AR">
          {card.spanish}
        </p>
      </div>

      <button type="button" className="btn btn-primary w-full" onClick={start} disabled={listening}>
        {listening ? t.speakListening : t.speakStart}
      </button>

      {result && (
        <div className={`animate-rise space-y-3 rounded-2xl p-4 ${RESULT_STYLE[result]}`}>
          <p className="font-semibold">{resultText(result, t)}</p>
          {heard && (
            <p className="text-sm" dir="ltr">
              {t.speakHeard}: {heard}
            </p>
          )}
          {result !== "correct" && willReturn && <p className="text-sm">{t.retryHint}</p>}
          <ListenButtons speechKey={`speak:${card.id}:${index}`} text={card.spanish} />
          <button
            type="button"
            className="btn btn-primary sticky bottom-[calc(5rem+env(safe-area-inset-bottom))] z-10 w-full"
            onClick={() => onGrade(result)}
          >
            {t.next}
          </button>
        </div>
      )}
    </div>
  );
}

export function SpeakSession({ cards, onRestart, onExit }: SessionProps) {
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const round = useRound(cards, () => setError(t.errorGeneric));

  if (round.finished || !round.card) {
    return <SessionSummary known={round.known} total={round.originalTotal} onRestart={onRestart} onExit={onExit} />;
  }

  return (
    <div className="space-y-4">
      <ErrorBanner message={error} onClose={() => setError(null)} />
      <SpeakCard
        key={`${round.card.id}:${round.index}`}
        card={round.card}
        index={round.index}
        total={round.total}
        willReturn={round.willReturn}
        onGrade={round.grade}
        onExit={onExit}
        onError={() => setError(t.errorGeneric)}
      />
    </div>
  );
}
