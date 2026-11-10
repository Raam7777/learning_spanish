"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { dictionaries, dirOf, LANG_COOKIE, type Dictionary, type Lang } from "@/lib/i18n/dictionary";

type I18nValue = Readonly<{
  lang: Lang;
  t: Dictionary;
  toggleLang: () => void;
}>;

const I18nContext = createContext<I18nValue | null>(null);

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const applyLang = (lang: Lang): void => {
  document.cookie = `${LANG_COOKIE}=${lang}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
  document.documentElement.lang = lang;
  document.documentElement.dir = dirOf(lang);
};

export function I18nProvider({ initialLang, children }: { initialLang: Lang; children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  const toggleLang = useCallback(() => {
    const nextLang: Lang = lang === "he" ? "en" : "he";
    applyLang(nextLang);
    setLang(nextLang);
  }, [lang]);

  const value = useMemo(() => ({ lang, t: dictionaries[lang], toggleLang }), [lang, toggleLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export const useI18n = (): I18nValue => {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return value;
};
