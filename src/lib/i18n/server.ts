import { cookies } from "next/headers";
import { isLang, LANG_COOKIE, type Lang } from "./dictionary";

export const getServerLang = async (): Promise<Lang> => {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return isLang(value) ? value : "he";
};
