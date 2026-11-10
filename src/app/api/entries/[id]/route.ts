import { NextResponse } from "next/server";
import { apiError, readJson, withUser } from "@/lib/api";
import { entryIdSchema, toEntryDto, updateEntrySchema } from "@/lib/entries/dto";
import { deleteEntry, setEntryStarred } from "@/lib/entries/repository";

type Context = Readonly<{ params: Promise<{ id: string }> }>;

const parseId = async ({ params }: Context): Promise<string | null> => {
  const parsed = entryIdSchema.safeParse((await params).id);
  return parsed.success ? parsed.data : null;
};

export const PATCH = (request: Request, context: Context) =>
  withUser(async (user) => {
    const [id, body] = await Promise.all([parseId(context), readJson(request, updateEntrySchema)]);
    if (!id || !body) return apiError("invalid_input", 400);

    const updated = await setEntryStarred(user.id, id, body.starred);
    return updated ? NextResponse.json(toEntryDto(updated)) : apiError("not_found", 404);
  });

export const DELETE = (_request: Request, context: Context) =>
  withUser(async (user) => {
    const id = await parseId(context);
    if (!id) return apiError("invalid_input", 400);

    const deleted = await deleteEntry(user.id, id);
    return deleted ? new NextResponse(null, { status: 204 }) : apiError("not_found", 404);
  });
