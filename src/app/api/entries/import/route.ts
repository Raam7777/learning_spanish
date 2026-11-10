import { NextResponse } from "next/server";
import * as z from "zod";
import { apiError, readJson, withUser } from "@/lib/api";
import { importLessonExamples } from "@/lib/entries/repository";
import { GRAMMAR_LESSONS } from "@/lib/grammar/lessons";
import { getServerLang } from "@/lib/i18n/server";
import { logger } from "@/lib/logger";

const importSchema = z.object({
  lessonId: z.string().trim().min(1).max(40),
});

export const POST = (request: Request) =>
  withUser(async (user) => {
    const body = await readJson(request, importSchema);
    const lesson = GRAMMAR_LESSONS.find((item) => item.id === body?.lessonId);
    if (!body || !lesson) return apiError("invalid_input", 400);

    const lang = await getServerLang();
    const added = await importLessonExamples(user.id, lang, lesson.examples);
    logger.info("Grammar examples imported", { userId: user.id, lessonId: lesson.id, added });
    return NextResponse.json({ added });
  });
