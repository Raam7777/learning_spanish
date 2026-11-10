import { NextResponse } from "next/server";
import * as z from "zod";
import { meteredErrorResponse, runMetered } from "@/lib/ai/metered";
import { TUTOR_INSTRUCTION } from "@/lib/ai/prompts";
import { apiError, readJson, withUser } from "@/lib/api";
import { MAX_INPUT_LENGTH } from "@/lib/translation/schema";

const tutorSchema = z.object({
  question: z.string().trim().min(1).max(MAX_INPUT_LENGTH),
});

export const POST = (request: Request) =>
  withUser(async (user) => {
    const body = await readJson(request, tutorSchema);
    if (!body) return apiError("invalid_input", 400);

    const result = await runMetered(user.id, "tutor", TUTOR_INSTRUCTION, body.question);
    return result.ok ? NextResponse.json({ text: result.text }) : meteredErrorResponse(result.code);
  });
