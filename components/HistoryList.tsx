"use client";

import type { HistoryEntry } from "@/types";
import { formatHours } from "@/lib/plans";

export function HistoryList({ items }: { items: HistoryEntry[] }) {
  return (
    <div className="bg-card rounded-2xl p-6 mt-4">
      <h2 className="text-[15px] uppercase tracking-wider text-muted font-semibold mb-3.5">
        История
      </h2>

      {items.length === 0 ? (
        <div className="text-center text-muted py-5 text-sm">
          Пока пусто. Начни первую сессию 💪
        </div>
      ) : (
        items.slice(0, 10).map((s, i) => {
          const done = s.duration >= s.planned * 0.95;
          const d = new Date(s.date);
          const dateStr = d.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "short",
          });
          return (
            <div
              key={i}
              className="flex justify-between py-3 text-sm border-b border-white/5 last:border-b-0"
            >
              <span className="text-muted">
                {dateStr} · {s.planned}ч
              </span>
              <span
                className={`font-semibold ${done ? "text-accent2" : "text-danger"}`}
              >
                {formatHours(s.duration)} {done ? "✓" : "✗"}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
}
