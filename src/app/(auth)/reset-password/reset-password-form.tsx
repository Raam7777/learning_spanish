"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthField } from "@/components/auth-frame";
import { ErrorBanner } from "@/components/error-banner";
import { useI18n } from "@/components/i18n-provider";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/client/auth-errors";

export function ResetPasswordForm({ token }: { token: string | null }) {
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setBusy(true);
    setError(null);
    const { error: authError } = await authClient.resetPassword({ newPassword: password, token });
    setBusy(false);
    if (authError) {
      setError(authErrorMessage(authError.code, t));
      return;
    }
    setDone(true);
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h2 className="text-xl font-bold text-ink">{t.resetTitle}</h2>
      {!token ? (
        <p className="rounded-xl bg-terracotta-soft px-4 py-3 text-sm text-terracotta-dark">{t.resetInvalid}</p>
      ) : done ? (
        <p className="rounded-xl bg-olive-soft px-4 py-3 text-sm text-ink">{t.resetDone}</p>
      ) : (
        <>
          <AuthField
            label={t.newPassword}
            hint={t.passwordHint}
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={setPassword}
            minLength={8}
          />
          <ErrorBanner message={error} onClose={() => setError(null)} />
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? t.working : t.resetButton}
          </button>
        </>
      )}
      <Link href={token && !done ? "/forgot-password" : "/login"} className="block text-center text-sm font-semibold text-terracotta hover:underline">
        {token && !done ? t.forgotPassword : t.backToLogin}
      </Link>
    </form>
  );
}
