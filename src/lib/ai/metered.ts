import type { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { logger } from "@/lib/logger";
import { generateText } from "@/lib/translation/gemini";
import { countUsageToday, dailyLimit, recordAiCall, type AiKind } from "@/lib/usage";

export type MeteredError = "daily_limit" | "translation_failed";

export type MeteredResult = Readonly<{ ok: true; text: string }> | Readonly<{ ok: false; code: MeteredError }>;

export const runMetered = async (
  userId: string,
  kind: AiKind,
  systemInstruction: string,
  contents: string,
): Promise<MeteredResult> => {
  const usedToday = await countUsageToday(userId);
  if (usedToday >= dailyLimit()) {
    logger.warn("Daily AI limit reached", { userId, kind, usedToday, limit: dailyLimit() });
    return { ok: false, code: "daily_limit" };
  }
  const startedAt = Date.now();
  try {
    const text = await generateText(systemInstruction, contents);
    await recordAiCall(userId, kind);
    logger.info("AI call completed", { userId, kind, inputLength: contents.length, duration: Date.now() - startedAt });
    return { ok: true, text };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("AI call failed", {
      userId,
      kind,
      inputLength: contents.length,
      duration: Date.now() - startedAt,
      error: err.message,
      stack: err.stack,
    });
    return { ok: false, code: "translation_failed" };
  }
};

export const meteredErrorResponse = (code: MeteredError): NextResponse =>
  apiError(code, code === "daily_limit" ? 429 : 502);
