"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/components/i18n-provider";

type InstallEvent = Event & {
  prompt: () => Promise<void>;
};

const DISMISS_KEY = "install-dismissed";

export function InstallPrompt() {
  const { t } = useI18n();
  const [event, setEvent] = useState<InstallEvent | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return undefined;
    const onPrompt = (promptEvent: Event) => {
      promptEvent.preventDefault();
      setEvent(promptEvent as InstallEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!event) return null;

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setEvent(null);
  };

  const install = async () => {
    await event.prompt();
    setEvent(null);
  };

  return (
    <div className="mx-4 mt-3 flex flex-col gap-3 rounded-2xl border border-line bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-ink">{t.installTitle}</p>
        <p className="text-sm text-ink-soft">{t.installBody}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" className="btn btn-ghost" onClick={dismiss}>
          {t.installDismiss}
        </button>
        <button type="button" className="btn btn-primary" onClick={() => void install()}>
          {t.installAction}
        </button>
      </div>
    </div>
  );
}
