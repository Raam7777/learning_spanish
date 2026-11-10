"use client";

import { SpeakerIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { useSpeech } from "@/components/speech-provider";
import { DIGRAPHS, LETTERS, type Letter } from "@/lib/alphabet/letters";

function LetterCard({ item }: { item: Letter }) {
  const { t, lang } = useI18n();
  const { speak, speakingKey } = useSpeech();
  const key = `letter:${item.letter}`;
  const exampleKey = `${key}:example`;

  return (
    <li className={`card flex flex-col gap-3 p-4 ${item.rioplatense ? "border-celeste/60" : ""}`}>
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => speak(key, item.name)}
          className={`spanish text-4xl font-bold transition ${speakingKey === key ? "text-terracotta" : "text-ink"}`}
          dir="ltr"
          aria-label={`${t.listen}: ${item.name}`}
        >
          {item.letter}
        </button>
        {item.rioplatense && (
          <span className="rounded-full bg-celeste-soft px-2 py-0.5 text-xs font-medium text-ink" title={t.argentineNote}>
            🇦🇷
          </span>
        )}
      </div>

      <dl className="space-y-1.5 text-sm">
        <div className="flex gap-1.5">
          <dt className="text-ink-soft">{t.alphabetName}:</dt>
          <dd className="spanish font-semibold" dir="ltr" lang="es-AR">
            {item.name}
          </dd>
        </div>
        <div>
          <dt className="sr-only">{t.alphabetSound}</dt>
          <dd className="text-ink">{item.sound[lang]}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => speak(exampleKey, item.example.replace("·", ","))}
        className="mt-auto flex items-center justify-between gap-2 rounded-xl bg-paper px-3 py-2 text-start transition hover:bg-celeste-soft"
      >
        <span>
          <span className="spanish block font-semibold" dir="ltr" lang="es-AR">
            {item.example}
          </span>
          <span className="block text-xs text-ink-soft">{item.meaning[lang]}</span>
        </span>
        <SpeakerIcon width={18} height={18} className={speakingKey === exampleKey ? "text-terracotta" : "text-ink-soft"} />
      </button>
    </li>
  );
}

export function AlphabetView() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-bold text-ink">{t.alphabetTitle}</h1>
        <p className="text-ink-soft">{t.alphabetIntro}</p>
      </section>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {LETTERS.map((item) => (
          <LetterCard key={item.letter} item={item} />
        ))}
      </ul>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {DIGRAPHS.map((item) => (
          <LetterCard key={item.letter} item={item} />
        ))}
      </ul>
    </div>
  );
}
