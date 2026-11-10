"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { isArgentineLang, pickSpanishVoice } from "@/lib/speech/voice";

type Speed = "normal" | "slow";

type SpeechValue = Readonly<{
  supported: boolean;
  argentineVoice: boolean;
  speakingKey: string | null;
  speak: (key: string, text: string, speed?: Speed) => void;
  stop: () => void;
}>;

const RATES: Readonly<Record<Speed, number>> = { normal: 0.95, slow: 0.6 };

const SpeechContext = createContext<SpeechValue | null>(null);

const hasSpeech = (): boolean => typeof window !== "undefined" && "speechSynthesis" in window;

const currentVoice = (): SpeechSynthesisVoice | null =>
  hasSpeech() ? pickSpanishVoice(window.speechSynthesis.getVoices()) : null;

const subscribeVoices = (onChange: () => void): (() => void) => {
  if (!hasSpeech()) return () => undefined;
  window.speechSynthesis.addEventListener("voiceschanged", onChange);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", onChange);
};

const voiceLangSnapshot = (): string => currentVoice()?.lang ?? "";
const emptySnapshot = (): string => "";
const noopSubscribe = (): (() => void) => () => undefined;
const serverFalse = (): boolean => false;

export function SpeechProvider({ children }: { children: ReactNode }) {
  const supported = useSyncExternalStore(noopSubscribe, hasSpeech, serverFalse);
  const voiceLang = useSyncExternalStore(subscribeVoices, voiceLangSnapshot, emptySnapshot);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (!hasSpeech()) return;
    window.speechSynthesis.cancel();
    setSpeakingKey(null);
  }, []);

  const speak = useCallback((key: string, text: string, speed: Speed = "normal") => {
    if (!hasSpeech()) return;
    window.speechSynthesis.cancel();
    const voice = currentVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    Object.assign(utterance, { lang: voice?.lang ?? "es-AR", voice, rate: RATES[speed] });
    const clear = () => setSpeakingKey((current) => (current === key ? null : current));
    utterance.onend = clear;
    utterance.onerror = clear;
    setSpeakingKey(key);
    window.speechSynthesis.speak(utterance);
  }, []);

  const value = useMemo(
    () => ({
      supported,
      argentineVoice: isArgentineLang(voiceLang),
      speakingKey,
      speak,
      stop,
    }),
    [supported, voiceLang, speakingKey, speak, stop],
  );

  return <SpeechContext.Provider value={value}>{children}</SpeechContext.Provider>;
}

export const useSpeech = (): SpeechValue => {
  const value = useContext(SpeechContext);
  if (!value) {
    throw new Error("useSpeech must be used inside SpeechProvider");
  }
  return value;
};
