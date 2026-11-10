import { Resend } from "resend";
import { optionalEnv, requireEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { memoize } from "@/lib/memoize";

const getResend = memoize(() => new Resend(requireEnv("RESEND_API_KEY")));

type ResetEmail = Readonly<{ to: string; userId: string; url: string }>;

const resetEmailHtml = (url: string): string => `
<div dir="rtl" style="font-family:Arial,sans-serif;background:#fbf6ec;padding:24px;color:#2b2622">
  <h2 style="color:#c65d3b;margin:0 0 12px">איפוס סיסמה · Che Español</h2>
  <p>קיבלנו בקשה לאפס את הסיסמה שלך. הקישור תקף לשעה אחת.</p>
  <p dir="ltr" style="text-align:right">We received a request to reset your password. The link is valid for one hour.</p>
  <p><a href="${url}" style="display:inline-block;background:#c65d3b;color:#fff;padding:12px 20px;border-radius:12px;text-decoration:none">איפוס סיסמה · Reset password</a></p>
  <p style="color:#7a6e63;font-size:13px">אם לא ביקשת איפוס, אפשר להתעלם מהמייל הזה.</p>
</div>`;

export const sendResetPasswordEmail = async ({ to, userId, url }: ResetEmail): Promise<void> => {
  const { error } = await getResend().emails.send({
    from: optionalEnv("EMAIL_FROM", "Che Español <onboarding@resend.dev>"),
    to,
    subject: "איפוס סיסמה · Reset your password",
    html: resetEmailHtml(url),
  });
  if (error) {
    logger.error("Failed to send reset password email", { userId, provider: "resend", error: error.message });
    throw new Error("Failed to send reset password email");
  }
  logger.info("Reset password email sent", { userId, provider: "resend" });
};
