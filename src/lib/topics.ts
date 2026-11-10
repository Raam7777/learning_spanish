export const TOPICS = ["food", "travel", "chat", "grammar"] as const;

export type Topic = (typeof TOPICS)[number];

export const isTopic = (value: string): value is Topic => TOPICS.some((topic) => topic === value);
