"use client";

import { useI18n } from "@/components/i18n-provider";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { TOPICS, type Topic } from "@/lib/topics";

const LABEL: Readonly<Record<Topic, keyof Dictionary>> = {
  food: "topicFood",
  travel: "topicTravel",
  chat: "topicChat",
  grammar: "topicGrammar",
};

type Props = Readonly<{
  value: Topic | null;
  onChange: (topic: Topic | null) => void;
  allowAll?: boolean;
}>;

export function TopicChips({ value, onChange, allowAll = false }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap gap-2">
      {allowAll && (
        <button type="button" className="chip" aria-pressed={value === null} onClick={() => onChange(null)}>
          {t.filterAll}
        </button>
      )}
      {TOPICS.map((topic) => (
        <button
          key={topic}
          type="button"
          className="chip"
          aria-pressed={value === topic}
          onClick={() => onChange(value === topic && !allowAll ? null : topic)}
        >
          {t[LABEL[topic]]}
        </button>
      ))}
    </div>
  );
}
