import { NextResponse } from "next/server";
import * as z from "zod";
import { meteredErrorResponse, runMetered } from "@/lib/ai/metered";
import { TUTOR_INSTRUCTION, tutorContents } from "@/lib/ai/prompts";
import { apiError, readJson, withUser } from "@/lib/api";
import { GRAMMAR_LESSONS } from "@/lib/grammar/lessons";
import { getServerLang } from "@/lib/i18n/server";
import { MAX_INPUT_LENGTH } from "@/lib/translation/schema";

const turnSchema = z.object({
  role: z.enum(["user", "teacher"]),
  text: z.string().trim().min(1).max(MAX_INPUT_LENGTH),
});

const tutorSchema = z.object({
  question: z.string().trim().min(1).max(MAX_INPUT_LENGTH),
  lessonId: z.string().trim().min(1).max(40).optional(),
  history: z.array(turnSchema).max(8).optional(),
});

export const POST = (request: Request) =>
  withUser(async (user) => {
    const body = await readJson(request, tutorSchema);
    if (!body) return apiError("invalid_input", 400);

    const lang = await getServerLang();
    const lesson = GRAMMAR_LESSONS.find((item) => item.id === body.lessonId);
    const contents = tutorContents(body.question, lesson ? lesson.title[lang] : null, body.history ?? []);
    const result = await runMetered(user.id, "tutor", TUTOR_INSTRUCTION, contents);
    return result.ok ? NextResponse.json({ text: result.text }) : meteredErrorResponse(result.code);
  });
