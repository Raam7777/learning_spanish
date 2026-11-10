import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { requireEnv } from "@/lib/env";
import { memoize } from "@/lib/memoize";
import * as schema from "./schema";

const createDb = () => drizzle({ client: neon(requireEnv("DATABASE_URL")), schema });

export type Database = ReturnType<typeof createDb>;

export const getDb = memoize(createDb);
