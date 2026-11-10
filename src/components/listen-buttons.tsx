"use client";

import { SpeakerIcon, StopIcon, TurtleIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { useSpeech } from "@/components/speech-provider";

type Props = Readonly<{ speechKey: string; text: string; size?: "md" | "lg" }>;

export function ListenButtons({ speechKey, text, size = "md" }: Props) {
  const { t } = useI18n();
  const { supported, speakingKey, speak, stop } = useSpeech();
  const speaking = speakingKey === speechKey || speakingKey === `${speechKey}:slow`;
  const height = size === "lg" ? "min-h-12" : "min-h-10";

  if (!supported) return null;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => (speaking ? stop() : speak(speechKey, text))}
        className={`btn btn-primary ${height} px-4`}
        aria-label={speaking ? t.stop : t.listen}
      >
        {speaking ? <StopIcon /> : <SpeakerIcon />}
        <span>{speaking ? t.stop : t.listen}</span>
      </button>
      <button
        type="button"
        onClick={() => speak(`${speechKey}:slow`, text, "slow")}
        className={`btn btn-ghost ${height} px-3`}
        aria-label={t.listenSlow}
      >
        <TurtleIcon />
        <span className="text-sm">{t.listenSlow}</span>
      </button>
    </div>
  );
}
