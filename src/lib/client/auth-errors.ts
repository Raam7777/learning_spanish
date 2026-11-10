import type { Dictionary } from "@/lib/i18n/dictionary";

const AUTH_ERROR_KEYS: Readonly<Record<string, keyof Dictionary>> = {
  INVALID_USERNAME_OR_PASSWORD: "authInvalid",
  INVALID_EMAIL_OR_PASSWORD: "authInvalid",
  USERNAME_IS_ALREADY_TAKEN: "authUsernameTaken",
  USER_ALREADY_EXISTS: "authEmailTaken",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "authEmailTaken",
  INVALID_USERNAME: "authInvalidUsername",
  USERNAME_TOO_SHORT: "authInvalidUsername",
  USERNAME_TOO_LONG: "authInvalidUsername",
  PASSWORD_TOO_SHORT: "authWeakPassword",
  INVALID_TOKEN: "resetInvalid",
};

export const authErrorMessage = (code: string | undefined, t: Dictionary): string =>
  t[(code && AUTH_ERROR_KEYS[code]) || "errorGeneric"];
