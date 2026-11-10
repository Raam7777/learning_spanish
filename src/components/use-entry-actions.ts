"use client";

import { useCallback, type Dispatch, type SetStateAction } from "react";
import { useI18n } from "@/components/i18n-provider";
import { removeEntry, updateStarred } from "@/lib/client/api";
import type { EntryDto } from "@/lib/entries/dto";

type SetEntries = Dispatch<SetStateAction<readonly EntryDto[]>>;

const replaceEntry = (updated: EntryDto) => (entries: readonly EntryDto[]) =>
  entries.map((item) => (item.id === updated.id ? updated : item));

const withoutEntry = (id: string) => (entries: readonly EntryDto[]) => entries.filter((item) => item.id !== id);

export const useEntryActions = (setEntries: SetEntries, onError: (message: string) => void) => {
  const { t } = useI18n();

  const toggleStar = useCallback(
    async (entry: EntryDto) => {
      const optimistic = { ...entry, starred: !entry.starred };
      setEntries(replaceEntry(optimistic));
      await updateStarred(entry.id, optimistic.starred).catch(() => {
        setEntries(replaceEntry(entry));
        onError(t.errorGeneric);
      });
    },
    [setEntries, onError, t],
  );

  const remove = useCallback(
    async (entry: EntryDto) => {
      if (!window.confirm(t.confirmDelete)) return;
      setEntries(withoutEntry(entry.id));
      await removeEntry(entry.id).catch(() => {
        setEntries((entries) => [entry, ...entries]);
        onError(t.errorGeneric);
      });
    },
    [setEntries, onError, t],
  );

  return { toggleStar, remove };
};
