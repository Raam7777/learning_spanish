import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { headers } from "next/headers";
import { getDb } from "@/db";
import * as schema from "@/db/schema";
import { sendResetPasswordEmail } from "@/lib/email";
import { memoize } from "@/lib/memoize";

const USERNAME_PATTERN = /^[a-zA-Z0-9_.]+$/;

const localOrigins = ["http://localhost:*", "http://127.0.0.1:*"];

const createAuth = () =>
  betterAuth({
    trustedOrigins: process.env.NODE_ENV === "development" ? localOrigins : [],
    database: drizzleAdapter(getDb(), {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await sendResetPasswordEmail({ to: user.email, userId: user.id, url });
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 60,
      updateAge: 60 * 60 * 24,
    },
    plugins: [
      username({
        minUsernameLength: 3,
        maxUsernameLength: 30,
        usernameValidator: (value) => USERNAME_PATTERN.test(value),
      }),
      nextCookies(),
    ],
  });

export const getAuth = memoize(createAuth);

export type SessionUser = Readonly<{ id: string; name: string; username: string | null }>;

export const getSessionUser = async (): Promise<SessionUser | null> => {
  const session = await getAuth().api.getSession({ headers: await headers() });
  return session
    ? { id: session.user.id, name: session.user.name, username: session.user.username ?? null }
    : null;
};
