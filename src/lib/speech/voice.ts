const VOICE_PREFERENCE: readonly string[] = ["es-ar", "es-uy", "es-419", "es-us", "es-mx", "es-co", "es-cl", "es-es", "es"];

const normalizeLang = (lang: string): string => lang.toLowerCase().replace("_", "-");

const rankOf = (voice: SpeechSynthesisVoice): number => {
  const lang = normalizeLang(voice.lang);
  const index = VOICE_PREFERENCE.findIndex((prefix) => lang === prefix || lang.startsWith(`${prefix}-`));
  return index === -1 ? Number.POSITIVE_INFINITY : index;
};

export const pickSpanishVoice = (voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice | null =>
  voices
    .filter((voice) => Number.isFinite(rankOf(voice)))
    .reduce<SpeechSynthesisVoice | null>(
      (best, voice) => (best === null || rankOf(voice) < rankOf(best) ? voice : best),
      null,
    );

export const isArgentineLang = (lang: string): boolean => normalizeLang(lang) === "es-ar";
