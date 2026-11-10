"use client";

import type { ReactNode } from "react";
import { SunIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";

export function AuthFrame({ children }: { children: ReactNode }) {
  const { t, toggleLang } = useI18n();
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-10">
      <div className="flex justify-end">
        <button type="button" onClick={toggleLang} className="chip font-semibold" aria-label="Language">
          {t.switchLang}
        </button>
      </div>
      <div className="mt-8 mb-8 flex flex-col items-center gap-2 text-center">
        <SunIcon width={56} height={56} />
        <h1 className="spanish text-4xl font-bold text-terracotta">{t.appName}</h1>
        <p className="text-ink-soft">{t.tagline}</p>
      </div>
      {children}
    </div>
  );
}

type FieldProps = Readonly<{
  label: string;
  hint?: string;
  name: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
}>;

export function AuthField({ label, hint, name, type = "text", autoComplete, value, onChange, minLength }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        minLength={minLength}
        required
        dir="ltr"
        className="field"
      />
      {hint && <span className="block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}
