import { GoogleGenAI } from "@google/genai";
import { optionalEnv, requireEnv } from "@/lib/env";
import { memoize } from "@/lib/memoize";
import { SYSTEM_INSTRUCTION, userPrompt } from "./prompt";
import { translationJsonSchema, translationSchema } from "./schema";
import type { Translation } from "./types";

const DEFAULT_MODEL = "gemini-3.5-flash-lite";

const getClient = memoize(() => new GoogleGenAI({ apiKey: requireEnv("GEMINI_API_KEY") }));

const parseTranslation = (raw: string | undefined): Translation => translationSchema.parse(JSON.parse(raw ?? ""));

export const generateText = async (systemInstruction: string, contents: string): Promise<string> => {
  const response = await getClient().models.generateContent({
    model: optionalEnv("GEMINI_MODEL", DEFAULT_MODEL),
    contents,
    config: { systemInstruction, temperature: 0.4 },
  });
  const text = response.text?.trim();
  if (!text) throw new Error("Empty model response");
  return text;
};

export const translateToRioplatense = async (text: string): Promise<Translation> => {
  const response = await getClient().models.generateContent({
    model: optionalEnv("GEMINI_MODEL", DEFAULT_MODEL),
    contents: userPrompt(text),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseJsonSchema: translationJsonSchema,
      temperature: 0.3,
    },
  });
  return parseTranslation(response.text);
};
