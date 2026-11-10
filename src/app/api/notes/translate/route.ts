import { NextResponse } from "next/server";
import * as z from "zod";
import { meteredErrorResponse, runMetered } from "@/lib/ai/metered";
import { noteTranslationInstruction } from "@/lib/ai/prompts";
import { apiError, readJson, withUser } from "@/lib/api";
import { MAX_INPUT_LENGTH } from "@/lib/translation/schema";

const noteTranslateSchema = z.object({
  text: z.string().trim().min(1).max(MAX_INPUT_LENGTH),
  target: z.enum(["he", "en"]),
});

export const POST = (request: Request) =>
  withUser(async (user) => {
    const body = await readJson(request, noteTranslateSchema);
    if (!body) return apiError("invalid_input", 400);

    const result = await runMetered(user.id, "note", noteTranslationInstruction(body.target), body.text);
    return result.ok ? NextResponse.json({ text: result.text }) : meteredErrorResponse(result.code);
  });
