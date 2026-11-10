import { ResetPasswordForm } from "./reset-password-form";

type Props = Readonly<{ searchParams: Promise<{ token?: string; error?: string }> }>;

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token, error } = await searchParams;
  return <ResetPasswordForm token={error ? null : (token ?? null)} />;
}
