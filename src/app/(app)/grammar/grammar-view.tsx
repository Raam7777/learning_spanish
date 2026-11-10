"use client";

import { useI18n } from "@/components/i18n-provider";
import { GRAMMAR_LESSONS } from "@/lib/grammar/lessons";
import { GrammarTutor } from "./grammar-tutor";

export function GrammarView() {
  const { t, lang } = useI18n();

  return (
    <div className="space-y-6">
      <section className="space-y-1">
        <h1 className="text-2xl font-bold text-ink">{t.grammarTitle}</h1>
        <p className="text-ink-soft">{t.grammarIntro}</p>
      </section>

      <div className="space-y-3">
        {GRAMMAR_LESSONS.map((lesson) => (
          <details key={lesson.id} className="card p-4">
            <summary className="flex cursor-pointer list-none flex-col gap-0.5">
              <span className="font-bold text-ink">{lesson.title[lang]}</span>
              <span className="text-sm text-ink-soft">{lesson.summary[lang]}</span>
            </summary>

            <ul className="mt-4 list-disc space-y-2 ps-5 text-sm leading-relaxed text-ink" dir="auto">
              {lesson.rules.map((rule, index) => (
                <li key={index}>{rule[lang]}</li>
              ))}
            </ul>

            <div className="mt-4 space-y-2">
              {lesson.examples.map((example) => (
                <div key={example.es} className="rounded-xl bg-paper px-3 py-2">
                  <p className="spanish font-semibold text-ink" dir="ltr" lang="es-AR">
                    {example.es}
                  </p>
                  <p className="text-sm text-ink-soft" dir="auto">
                    {example[lang]}
                  </p>
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>

      <GrammarTutor />
    </div>
  );
}
