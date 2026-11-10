import { NextResponse } from "next/server";
import { apiError, withUser } from "@/lib/api";
import { listQuerySchema, searchParamsObject, toEntryDto } from "@/lib/entries/dto";
import { listEntries } from "@/lib/entries/repository";

export const GET = (request: Request) =>
  withUser(async (user) => {
    const parsed = listQuerySchema.safeParse(searchParamsObject(request));
    if (!parsed.success) return apiError("invalid_input", 400);

    const { q, starred, topic, page, limit } = parsed.data;
    const result = await listEntries({ userId: user.id, query: q, starredOnly: starred === "1", topic }, page, limit);
    return NextResponse.json({ ...result, data: result.data.map(toEntryDto) });
  });
