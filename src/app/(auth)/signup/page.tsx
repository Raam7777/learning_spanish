"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AuthField } from "@/components/auth-frame";
import { ErrorBanner } from "@/components/error-banner";
import { useI18n } from "@/components/i18n-provider";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/client/auth-errors";

export default function SignupPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const cleanUsername = username.trim();
    const { data, error: authError } = await authClient.signUp.email({
      email: email.trim(),
      password,
      name: cleanUsername,
      username: cleanUsername,
      callbackURL: "/",
    });
    setBusy(false);
    if (authError) {
      setError(authErrorMessage(authError.code, t));
      return;
    }
    if (!data?.token) {
      setPending(true);
      return;
    }
    router.replace("/");
    router.refresh();
  };

  if (pending) {
    return (
      <div className="card space-y-4 p-6">
        <h2 className="text-xl font-bold text-ink">{t.signupTitle}</h2>
        <p className="text-ink-soft">{t.signupCheckEmail}</p>
        <Link href="/login" className="btn btn-primary w-full">
          {t.backToLogin}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6">
      <h2 className="text-xl font-bold text-ink">{t.signupTitle}</h2>
      <AuthField
        label={t.username}
        hint={t.usernameHint}
        name="username"
        autoComplete="username"
        value={username}
        onChange={setUsername}
        minLength={3}
      />
      <AuthField
        label={t.email}
        hint={t.emailHint}
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={setEmail}
      />
      <AuthField
        label={t.password}
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
        {busy ? t.working : t.signupButton}
      </button>
      <p className="text-center text-sm text-ink-soft">
        {t.haveAccount}{" "}
        <Link href="/login" className="font-semibold text-terracotta hover:underline">
          {t.loginTitle}
        </Link>
      </p>
    </form>
  );
}
