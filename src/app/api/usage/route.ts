import { NextResponse } from "next/server";
import { withUser } from "@/lib/api";
import { countUsageToday, dailyLimit } from "@/lib/usage";

export const GET = () =>
  withUser(async (user) => {
    const used = await countUsageToday(user.id);
    const limit = dailyLimit();
    return NextResponse.json({ used, limit, remaining: Math.max(0, limit - used) });
  });
