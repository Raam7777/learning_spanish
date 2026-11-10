export type SourceLanguage = "he" | "en";

export type BreakdownItem = Readonly<{
  spanish: string;
  meaning: string;
}>;

export type Translation = Readonly<{
  sourceLanguage: SourceLanguage;
  spanish: string;
  breakdown: readonly BreakdownItem[];
  note: string | null;
}>;
