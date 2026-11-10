import { NextResponse } from "next/server";
import { apiError, withUser } from "@/lib/api";
import { practiceQuerySchema, searchParamsObject, toEntryDto } from "@/lib/entries/dto";
import { randomEntries } from "@/lib/entries/repository";

export const GET = (request: Request) =>
  withUser(async (user) => {
    const parsed = practiceQuerySchema.safeParse(searchParamsObject(request));
    if (!parsed.success) return apiError("invalid_input", 400);

    const { pool, limit } = parsed.data;
    const cards = await randomEntries({ userId: user.id, starredOnly: pool === "starred" }, limit);
    return NextResponse.json({ data: cards.map(toEntryDto) });
  });
