"use client";

import { XIcon } from "@/components/icons";

export function ErrorBanner({ message, onClose }: { message: string | null; onClose: () => void }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-start justify-between gap-3 rounded-xl border border-terracotta/30 bg-terracotta-soft px-4 py-3 text-sm text-terracotta-dark">
      <span>{message}</span>
      <button type="button" onClick={onClose} className="shrink-0" aria-label="Close">
        <XIcon width={18} height={18} />
      </button>
    </div>
  );
}
