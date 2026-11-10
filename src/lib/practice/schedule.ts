export type Grade = "correct" | "accents" | "wrong";

export type ReviewState = Readonly<{
  ease: number;
  intervalDays: number;
  repetitions: number;
  dueAt: Date;
}>;

const MIN_EASE = 1.3;
const MAX_EASE = 2.8;
const DAY_MS = 24 * 60 * 60 * 1000;
const RETRY_MS = 10 * 60 * 1000;

const easeOf = (value: number): number => Math.round(Math.min(MAX_EASE, Math.max(MIN_EASE, value)) * 10) / 10;

export const initialReview = (now: Date): ReviewState => ({
  ease: 2.5,
  intervalDays: 0,
  repetitions: 0,
  dueAt: now,
});

const intervalAfterSuccess = (state: ReviewState): number =>
  state.repetitions === 0 ? 1 : state.repetitions === 1 ? 3 : Math.max(1, Math.round(state.intervalDays * state.ease));

export const applyReview = (state: ReviewState, grade: Grade, now: Date): ReviewState => {
  if (grade === "wrong") {
    return { ease: easeOf(state.ease - 0.2), intervalDays: 0, repetitions: 0, dueAt: new Date(now.getTime() + RETRY_MS) };
  }
  if (grade === "accents") {
    return { ...state, intervalDays: 0, dueAt: new Date(now.getTime() + RETRY_MS) };
  }
  const intervalDays = intervalAfterSuccess(state);
  return {
    ease: easeOf(state.ease + 0.1),
    intervalDays,
    repetitions: state.repetitions + 1,
    dueAt: new Date(now.getTime() + intervalDays * DAY_MS),
  };
};
