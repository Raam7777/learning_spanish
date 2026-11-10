import { getAuth } from "@/lib/auth";

const handle = (request: Request) => getAuth().handler(request);

export const GET = handle;
export const POST = handle;
