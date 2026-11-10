"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthField } from "@/components/auth-frame";
import { ErrorBanner } from "@/components/error-banner";
import { useI18n } from "@/components/i18n-provider";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/client/auth-errors";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: authError } = await authClient.signIn.username({ username: username.trim(), password });
    setBusy(false);
    if (authError) {
      setError(authErrorMessage(authError.code, t));
      return;
    }
    router.replace("/");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h2 className="text-xl font-bold text-ink">{t.loginTitle}</h2>
      <AuthField label={t.username} name="username" autoComplete="username" value={username} onChange={setUsername} />
      <AuthField
        label={t.password}
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
      />
      <ErrorBanner message={error} onClose={() => setError(null)} />
      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? t.working : t.loginButton}
      </button>
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <Link href="/forgot-password" className="text-ink-soft hover:text-ink hover:underline">
          {t.forgotPassword}
        </Link>
        <span className="text-ink-soft">
          {t.noAccount}{" "}
          <Link href="/signup" className="font-semibold text-terracotta hover:underline">
            {t.signupTitle}
          </Link>
        </span>
      </div>
    </form>
  );
}
