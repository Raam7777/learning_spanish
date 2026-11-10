import { NextResponse } from "next/server";
import { apiError, withUser } from "@/lib/api";
import { practiceQuerySchema, searchParamsObject } from "@/lib/entries/dto";
import { getServerLang } from "@/lib/i18n/server";
import { selectPractice } from "@/lib/practice/select";

export const GET = (request: Request) =>
  withUser(async (user) => {
    const parsed = practiceQuerySchema.safeParse(searchParamsObject(request));
    if (!parsed.success) return apiError("invalid_input", 400);

    const { pool, topic, limit } = parsed.data;
    const selection = await selectPractice(user.id, pool, topic, limit, await getServerLang(), new Date());
    return NextResponse.json(selection);
  });
