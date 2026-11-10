const baseOf = (char: string): string => char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const isLetter = (char: string): boolean => /\p{L}/u.test(char);

const hasAccent = (char: string): boolean => char.normalize("NFD") !== baseOf(char);

export type AccentPiece = Readonly<{ text: string; missing: boolean }>;

const mark = (rest: readonly string[], chars: readonly string[]): readonly AccentPiece[] => {
  const [text, ...tail] = chars;
  if (text === undefined) return [];
  if (!isLetter(text)) return [{ text, missing: false }, ...mark(rest, tail)];
  const base = baseOf(text).toLowerCase();
  const offset = rest.findIndex((char) => baseOf(char) === base);
  const matched = offset < 0 ? undefined : rest[offset];
  const next = offset < 0 ? rest : rest.slice(offset + 1);
  return [{ text, missing: hasAccent(text) && (matched === undefined || !hasAccent(matched)) }, ...mark(next, tail)];
};

export const accentPieces = (answer: string, expected: string): readonly AccentPiece[] =>
  mark([...answer.toLowerCase()], [...expected]);
