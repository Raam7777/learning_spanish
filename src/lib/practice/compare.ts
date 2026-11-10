export type AnswerResult = "correct" | "accents" | "wrong";

const normalizeSpacing = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[¿?¡!.,;:"'«»()\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripAccents = (value: string): string => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const compareAnswer = (answer: string, expected: string): AnswerResult => {
  const given = normalizeSpacing(answer);
  const target = normalizeSpacing(expected);
  return given === target ? "correct" : stripAccents(given) === stripAccents(target) ? "accents" : "wrong";
};
