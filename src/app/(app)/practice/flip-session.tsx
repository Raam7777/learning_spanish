"use client";

import { useState } from "react";
import { CheckIcon, XIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { ListenButtons } from "@/components/listen-buttons";
import { SessionHeader, SessionSummary, SourceText, type SessionProps } from "./session-chrome";

export function FlipSession({ cards, onRestart, onExit }: SessionProps) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);

  if (index >= cards.length) {
    return <SessionSummary known={known} total={cards.length} onRestart={onRestart} onExit={onExit} />;
  }

  const card = cards[index];

  const answer = (knewIt: boolean) => {
    setKnown((value) => value + (knewIt ? 1 : 0));
    setFlipped(false);
    setIndex((value) => value + 1);
  };

  return (
    <div className="space-y-5">
      <SessionHeader index={index} total={cards.length} onExit={onExit} />

      <div className="flip-card">
        <div className="flip-card-inner h-72" data-flipped={flipped}>
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="flip-face card flex flex-col items-center justify-center gap-4 p-6"
            aria-hidden={flipped}
            tabIndex={flipped ? -1 : 0}
          >
            <SourceText>{card.sourceText}</SourceText>
            <span className="text-sm text-ink-soft">{t.tapToReveal}</span>
          </button>
          <div
            className="flip-face flip-back card flex flex-col items-center justify-center gap-5 bg-celeste-soft p-6"
            aria-hidden={!flipped}
          >
            <p className="spanish text-center text-3xl font-semibold text-ink" dir="ltr" lang="es-AR">
              {card.spanish}
            </p>
            {flipped && <ListenButtons speechKey={`practice:${card.id}`} text={card.spanish} size="lg" />}
          </div>
        </div>
      </div>

      {flipped && (
        <div className="grid grid-cols-2 gap-3 animate-rise">
          <button type="button" className="btn btn-ghost" onClick={() => answer(false)}>
            <XIcon />
            {t.didntKnow}
          </button>
          <button type="button" className="btn bg-olive text-white" onClick={() => answer(true)}>
            <CheckIcon />
            {t.knewIt}
          </button>
        </div>
      )}
    </div>
  );
}
