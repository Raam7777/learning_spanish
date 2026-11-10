"use client";

import { useState } from "react";
import { ErrorBanner } from "@/components/error-banner";
import { useI18n } from "@/components/i18n-provider";
import { ApiError, translateNote } from "@/lib/client/api";

type Target = "he" | "en";
type Translated = Readonly<{ target: Target; text: string }>;

export function NoteTranslation({ note }: { note: string }) {
  const { t } = useI18n();
  const [translated, setTranslated] = useState<Translated | null>(null);
  const [busy, setBusy] = useState<Target | null>(null);
  const [error, setError] = useState<string | null>(null);

  const translate = async (target: Target) => {
    setBusy(target);
    setError(null);
    try {
      const { text } = await translateNote(note, target);
      setTranslated({ target, text });
    } catch (err) {
      setError(err instanceof ApiError && err.code === "daily_limit" ? t.errorDailyLimit : t.errorTranslation);
    } finally {
      setBusy(null);
    }
  };

  const targets: readonly { target: Target; label: string }[] = [
    { target: "he", label: t.noteToHe },
    { target: "en", label: t.noteToEn },
  ];

  return (
    <section className="space-y-2 rounded-xl bg-celeste-soft px-3 py-2.5 text-sm text-ink">
      <p>
        <span className="font-semibold">🇦🇷 {t.argentineNote}: </span>
        <span dir="auto">{note}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {targets.map(({ target, label }) => (
          <button
            key={target}
            type="button"
            onClick={() => void translate(target)}
            disabled={busy !== null}
            className="chip text-xs"
          >
            {busy === target ? t.working : label}
          </button>
        ))}
      </div>
      {translated && (
        <p className="border-t border-celeste/40 pt-2" dir="auto">
          {translated.text}
        </p>
      )}
      <ErrorBanner message={error} onClose={() => setError(null)} />
    </section>
  );
}
