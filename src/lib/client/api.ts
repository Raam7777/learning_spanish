import type { ApiErrorCode } from "@/lib/api";
import type { EntryDto } from "@/lib/entries/dto";
import type { Page } from "@/lib/entries/repository";

export class ApiError extends Error {
  constructor(readonly code: ApiErrorCode | "network") {
    super(code);
  }
}

const request = async <T>(input: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  }).catch(() => {
    throw new ApiError("network");
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: ApiErrorCode };
    throw new ApiError(body.error ?? "network");
  }
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
};

const query = (params: Readonly<Record<string, string | number | undefined>>): string =>
  new URLSearchParams(
    Object.entries(params)
      .filter((pair): pair is [string, string | number] => pair[1] !== undefined && pair[1] !== "")
      .map(([key, value]) => [key, String(value)]),
  ).toString();

export const translate = (text: string): Promise<EntryDto> =>
  request<EntryDto>("/api/translations", { method: "POST", body: JSON.stringify({ text }) });

export const fetchEntries = (params: { q?: string; starred?: boolean; page?: number; limit?: number }) =>
  request<Page<EntryDto>>(
    `/api/entries?${query({ q: params.q, starred: params.starred ? "1" : undefined, page: params.page, limit: params.limit })}`,
  );

export const fetchPracticeCards = (pool: "all" | "starred") =>
  request<{ data: EntryDto[] }>(`/api/practice?${query({ pool })}`);

export const updateStarred = (id: string, starred: boolean): Promise<EntryDto> =>
  request<EntryDto>(`/api/entries/${id}`, { method: "PATCH", body: JSON.stringify({ starred }) });

export const removeEntry = (id: string): Promise<void> => request<void>(`/api/entries/${id}`, { method: "DELETE" });

export const translateNote = (text: string, target: "he" | "en"): Promise<{ text: string }> =>
  request<{ text: string }>("/api/notes/translate", { method: "POST", body: JSON.stringify({ text, target }) });

export const askTutor = (question: string): Promise<{ text: string }> =>
  request<{ text: string }>("/api/tutor", { method: "POST", body: JSON.stringify({ question }) });
