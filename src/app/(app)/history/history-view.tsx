"use client";

import { useEffect, useState } from "react";
import { EntryCard } from "@/components/entry-card";
import { ErrorBanner } from "@/components/error-banner";
import { SearchIcon, StarIcon } from "@/components/icons";
import { useI18n } from "@/components/i18n-provider";
import { useEntryActions } from "@/components/use-entry-actions";
import { TopicChips } from "@/components/topic-chips";
import { ApiError, fetchEntries } from "@/lib/client/api";
import { useDebounced } from "@/lib/client/use-debounced";
import type { EntryDto } from "@/lib/entries/dto";
import type { Topic } from "@/lib/topics";

const HISTORY_CACHE = "che-history-v2";

const PAGE_SIZE = 20;

const filterKey = (q: string, starred: boolean, topic: Topic | null): string => `${starred ? "1" : "0"}|${topic ?? ""}|${q}`;

const readCache = (): readonly EntryDto[] => {
  try {
    const raw = localStorage.getItem(HISTORY_CACHE);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as EntryDto[]) : [];
  } catch {
    return [];
  }
};

export function HistoryView() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [starredOnly, setStarredOnly] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [entries, setEntries] = useState<readonly EntryDto[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offline, setOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toggleStar, remove, setTopic: saveTopic } = useEntryActions(setEntries, setError);
  const q = useDebounced(search.trim(), 300);
  const currentKey = filterKey(q, starredOnly, topic);
  const loading = loadedKey !== currentKey || loadingMore;

  useEffect(() => {
    const state = { cancelled: false };
    fetchEntries({ q, starred: starredOnly, topic: topic ?? undefined, page: 1, limit: PAGE_SIZE })
      .then((result) => {
        if (state.cancelled) return;
        setOffline(false);
        setEntries(result.data);
        setPage(result.page);
        setPages(result.pages);
        setLoadedKey(filterKey(q, starredOnly, topic));
        if (!q && !starredOnly && !topic) localStorage.setItem(HISTORY_CACHE, JSON.stringify(result.data));
      })
      .catch((error: unknown) => {
        if (state.cancelled) return;
        const cached = !q && !starredOnly && !topic && error instanceof ApiError && error.code === "network" ? readCache() : [];
        setOffline(cached.length > 0);
        setEntries(cached);
        setError(cached.length > 0 ? null : t.errorGeneric);
        setLoadedKey(filterKey(q, starredOnly, topic));
      });
    return () => {
      state.cancelled = true;
    };
  }, [q, starredOnly, topic, t.errorGeneric]);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const result = await fetchEntries({ q, starred: starredOnly, topic: topic ?? undefined, page: page + 1, limit: PAGE_SIZE });
      setEntries((current) => [...current, ...result.data]);
      setPage(result.page);
      setPages(result.pages);
    } catch {
      setError(t.errorGeneric);
    } finally {
      setLoadingMore(false);
    }
  };

  const emptyText = q || starredOnly || topic ? t.noResults : t.emptyHistory;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-ink">{t.historyTitle}</h1>

      <div className="space-y-3">
        <label className="relative block">
          <SearchIcon className="pointer-events-none absolute inset-y-0 start-3 my-auto text-ink-soft" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="field ps-11"
            dir="auto"
          />
        </label>
        <div className="flex gap-2">
          <button type="button" className="chip" aria-pressed={!starredOnly} onClick={() => setStarredOnly(false)}>
            {t.filterAll}
          </button>
          <button type="button" className="chip" aria-pressed={starredOnly} onClick={() => setStarredOnly(true)}>
            <StarIcon width={16} height={16} filled={starredOnly} />
            {t.filterStarred}
          </button>
        </div>
        <TopicChips value={topic} onChange={setTopic} allowAll />
      </div>

      {offline && <p className="text-sm text-ink-soft">{t.offlineHistory}</p>}
      <ErrorBanner message={error} onClose={() => setError(null)} />

      <div className={`space-y-3 transition-opacity ${loadedKey !== currentKey ? "opacity-50" : ""}`}>
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onToggleStar={toggleStar} onDelete={remove} onSetTopic={saveTopic} />
        ))}
      </div>

      {!loading && entries.length === 0 && <p className="card px-4 py-8 text-center text-ink-soft">{emptyText}</p>}

      {loading && <p className="text-center text-sm text-ink-soft">{t.loading}</p>}

      {!loading && page < pages && (
        <div className="flex justify-center">
          <button type="button" className="btn btn-ghost" onClick={() => void loadMore()}>
            {t.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}
