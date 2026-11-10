"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AuthField } from "@/components/auth-frame";
import { ErrorBanner } from "@/components/error-banner";
import { useI18n } from "@/components/i18n-provider";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/client/auth-errors";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: authError } = await authClient.requestPasswordReset({
      email: email.trim(),
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (authError) {
      setError(authErrorMessage(authError.code, t));
      return;
    }
    setSent(true);
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h2 className="text-xl font-bold text-ink">{t.forgotTitle}</h2>
      {sent ? (
        <p className="rounded-xl bg-olive-soft px-4 py-3 text-sm text-ink">{t.forgotSent}</p>
      ) : (
        <>
          <p className="text-sm text-ink-soft">{t.forgotIntro}</p>
          <AuthField label={t.email} name="email" type="email" autoComplete="email" value={email} onChange={setEmail} />
          <ErrorBanner message={error} onClose={() => setError(null)} />
          <button type="submit" className="btn btn-primary w-full" disabled={busy}>
            {busy ? t.working : t.forgotButton}
          </button>
        </>
      )}
      <Link href="/login" className="block text-center text-sm font-semibold text-terracotta hover:underline">
        {t.backToLogin}
      </Link>
    </form>
  );
}
