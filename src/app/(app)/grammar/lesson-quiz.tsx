"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/components/i18n-provider";
import { ApiError, importLesson } from "@/lib/client/api";
import type { Lesson } from "@/lib/grammar/lessons";
import { compareAnswer, type AnswerResult } from "@/lib/practice/compare";

type Props = Readonly<{ lesson: Lesson }>;

export function LessonQuiz({ lesson }: Props) {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [added, setAdded] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const example = lesson.examples[index];
  const finished = index >= lesson.examples.length;

  const reset = () => {
    setOpen(true);
    setIndex(0);
    setAnswer("");
    setResult(null);
    setAdded(null);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!example) return;
    if (result) {
      setResult(null);
      setAnswer("");
      setIndex((value) => value + 1);
      return;
    }
    if (!answer.trim()) return;
    setResult(compareAnswer(answer, example.es));
  };

  const save = async () => {
    setBusy(true);
    try {
      const response = await importLesson(lesson.id);
      setAdded(response.added);
    } catch (error) {
      if (error instanceof ApiError) setAdded(-1);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button type="button" className="btn btn-ghost mt-4" onClick={reset}>
        {t.quizStart}
      </button>
    );
  }

  if (!example || finished) {
    return (
      <div className="mt-4 space-y-3 rounded-2xl bg-paper px-4 py-4">
        <p className="font-semibold text-ink">{t.practiceDone}</p>
        <button type="button" className="btn btn-primary" onClick={() => void save()} disabled={busy || added !== null}>
          {busy ? t.working : t.quizAdd}
        </button>
        {added !== null && added >= 0 && <p className="text-sm text-ink-soft">{added > 0 ? t.quizAdded : t.quizAlready}</p>}
        {added !== null && added < 0 && <p className="text-sm text-terracotta">{t.errorGeneric}</p>}
        <button type="button" className="btn btn-ghost" onClick={reset}>
          {t.practiceAgain}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-2xl bg-paper px-4 py-4">
      <p className="text-sm text-ink-soft">{t.quizPrompt}</p>
      <p className="text-lg font-semibold text-ink" dir="auto">
        {example[lang]}
      </p>
      <input
        value={answer}
        onChange={(event) => setAnswer(event.target.value)}
        placeholder={t.typeAnswer}
        className="field spanish"
        dir="ltr"
        lang="es-AR"
        autoComplete="off"
        spellCheck={false}
        readOnly={result !== null}
      />
      {result && (
        <p className="spanish text-lg font-semibold text-ink" dir="ltr" lang="es-AR">
          {result === "correct" ? t.resultCorrect : example.es}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={!result && !answer.trim()}>
        {result ? t.next : t.check}
      </button>
    </form>
  );
}
