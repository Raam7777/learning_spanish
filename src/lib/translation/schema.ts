import * as z from "zod";

export const MAX_INPUT_LENGTH = 500;

export const translateRequestSchema = z.object({
  text: z.string().trim().min(1).max(MAX_INPUT_LENGTH),
});

export const translationSchema = z.object({
  sourceLanguage: z.enum(["he", "en"]),
  spanish: z.string().trim().min(1),
  breakdown: z
    .array(
      z.object({
        spanish: z.string().trim().min(1),
        meaning: z.string().trim().min(1),
      }),
    )
    .max(40),
  note: z
    .string()
    .trim()
    .nullable()
    .transform((value) => (value ? value : null)),
});

export const translationJsonSchema = {
  type: "object",
  properties: {
    sourceLanguage: { type: "string", enum: ["he", "en"] },
    spanish: { type: "string" },
    breakdown: {
      type: "array",
      items: {
        type: "object",
        properties: {
          spanish: { type: "string" },
          meaning: { type: "string" },
        },
        required: ["spanish", "meaning"],
      },
    },
    note: { type: ["string", "null"] },
  },
  required: ["sourceLanguage", "spanish", "breakdown", "note"],
} as const;
