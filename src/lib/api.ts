import { NextResponse } from "next/server";
import type * as z from "zod";
import { getSessionUser, type SessionUser } from "@/lib/auth";

export type ApiErrorCode = "unauthorized" | "invalid_input" | "not_found" | "daily_limit" | "translation_failed";

export const apiError = (code: ApiErrorCode, status: number): NextResponse =>
  NextResponse.json({ error: code }, { status });

type Authed = (user: SessionUser) => Promise<Response>;

export const withUser = async (handler: Authed): Promise<Response> => {
  const user = await getSessionUser();
  return user ? handler(user) : apiError("unauthorized", 401);
};

export const readJson = async <T>(request: Request, schema: z.ZodType<T>): Promise<T | null> => {
  const body: unknown = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  return parsed.success ? parsed.data : null;
};
