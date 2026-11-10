import { NextResponse } from "next/server";
import { apiError, readJson, withUser } from "@/lib/api";
import { toEntryDto } from "@/lib/entries/dto";
import { createEntry } from "@/lib/entries/repository";
import { logger } from "@/lib/logger";
import { translateToRioplatense } from "@/lib/translation/gemini";
import { translateRequestSchema } from "@/lib/translation/schema";
import type { Translation } from "@/lib/translation/types";
import { countUsageToday, dailyLimit } from "@/lib/usage";

const safeTranslate = async (userId: string, text: string): Promise<Translation | null> => {
  const startedAt = Date.now();
  try {
    const translation = await translateToRioplatense(text);
    logger.info("Translation completed", { userId, inputLength: text.length, duration: Date.now() - startedAt });
    return translation;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error("Translation failed", {
      userId,
      inputLength: text.length,
      duration: Date.now() - startedAt,
      error: err.message,
      stack: err.stack,
    });
    return null;
  }
};

export const POST = (request: Request) =>
  withUser(async (user) => {
    const body = await readJson(request, translateRequestSchema);
    if (!body) return apiError("invalid_input", 400);

    const usedToday = await countUsageToday(user.id);
    if (usedToday >= dailyLimit()) {
      logger.warn("Daily AI limit reached", { userId: user.id, usedToday, limit: dailyLimit() });
      return apiError("daily_limit", 429);
    }

    const translation = await safeTranslate(user.id, body.text);
    if (!translation) return apiError("translation_failed", 502);

    const created = await createEntry(user.id, body.text, translation);
    return NextResponse.json(toEntryDto(created), { status: 201 });
  });
