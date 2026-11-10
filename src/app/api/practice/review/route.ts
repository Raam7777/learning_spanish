import { NextResponse } from "next/server";
import * as z from "zod";
import { apiError, readJson, withUser } from "@/lib/api";
import {
  entryReviewState,
  saveEntryReview,
  saveStarterReview,
  starterReviewState,
} from "@/lib/entries/repository";
import { logger } from "@/lib/logger";
import { applyReview, initialReview, type Grade } from "@/lib/practice/schedule";
import { starterById } from "@/lib/practice/starter";

const reviewSchema = z.object({
  kind: z.enum(["entry", "starter"]),
  id: z.string().trim().min(1).max(80),
  result: z.enum(["correct", "accents", "wrong"]),
});

const isUuid = (value: string): boolean => z.uuid().safeParse(value).success;

export const POST = (request: Request) =>
  withUser(async (user) => {
    const body = await readJson(request, reviewSchema);
    if (!body) return apiError("invalid_input", 400);
    if (body.kind === "entry" && !isUuid(body.id)) return apiError("invalid_input", 400);
    if (body.kind === "starter" && !starterById(body.id)) return apiError("invalid_input", 400);

    const now = new Date();
    const current =
      body.kind === "entry"
        ? await entryReviewState(user.id, body.id)
        : ((await starterReviewState(user.id, body.id)) ?? initialReview(now));
    if (!current) return apiError("not_found", 404);

    const next = applyReview(current, body.result as Grade, now);
    if (body.kind === "entry") {
      const saved = await saveEntryReview(user.id, body.id, next);
      if (!saved) return apiError("not_found", 404);
    } else {
      await saveStarterReview(user.id, body.id, next);
    }

    logger.info("Practice review saved", { userId: user.id, kind: body.kind, cardId: body.id, result: body.result });
    return NextResponse.json({ dueAt: next.dueAt.toISOString() });
  });
