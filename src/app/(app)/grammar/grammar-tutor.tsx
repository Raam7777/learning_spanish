"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { ErrorBanner } from "@/components/error-banner";
import { SendIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { ApiError, askTutor } from "@/lib/client/api";

type Message = Readonly<{ role: "user" | "teacher"; text: string }>;

export function GrammarTutor() {
  const { t } = useI18n();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<readonly Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    const value = question.trim();
    if (!value || busy) return;
    setBusy(true);
    setError(null);
    try {
      const { text } = await askTutor(value);
      setMessages((current) => [...current, { role: "user", text: value }, { role: "teacher", text }]);
      setQuestion("");
    } catch (err) {
      setError(err instanceof ApiError && err.code === "daily_limit" ? t.errorDailyLimit : t.errorTranslation);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <section className="card space-y-4 p-5">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-ink">{t.tutorTitle}</h2>
        <p className="text-sm text-ink-soft">{t.tutorIntro}</p>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && <p className="text-sm text-ink-soft">{t.tutorEmpty}</p>}
        {messages.map((message, index) => (
          <div
            key={index}
            dir="auto"
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${message.role === "user" ? "ms-8 bg-paper-deep text-ink" : "me-8 bg-celeste-soft text-ink"}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <ErrorBanner message={error} onClose={() => setError(null)} />

      <form onSubmit={onSubmit} className="flex items-end gap-2">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.tutorPlaceholder}
          maxLength={500}
          rows={2}
          dir="auto"
          className="field min-h-12 flex-1 resize-none"
        />
        <button type="submit" className="btn btn-primary min-h-12" disabled={busy || !question.trim()}>
          {busy ? t.tutorThinking : t.tutorSend}
          {!busy && <SendIcon className="rtl:-scale-x-100" />}
        </button>
      </form>
    </section>
  );
}
