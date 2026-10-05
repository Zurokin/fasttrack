"use client";

import { useState } from "react";
import type { AchievementRecord, HistoryEntry } from "@/types";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { AchievementModal } from "@/components/AchievementModal";

interface Props {
  history: HistoryEntry[];
  unlocked: string[];
  records: AchievementRecord[];
}

export function Achievements({ history, unlocked, records }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENTS.length;

  if (unlockedCount === 0) return null;

  const visible = expanded
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter((a) => unlocked.includes(a.id));

  return (
    <>
      <div className="bg-card rounded-2xl p-5 mt-4 border border-white/5">
        <div className="flex items-baseline justify-between mb-3.5">
          <h2 className="text-[15px] uppercase tracking-wider text-muted font-semibold">
            Достижения
          </h2>
          <span className="text-[11px] text-muted tabular-nums">
            {unlockedCount} / {totalCount}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {visible.map((a) => {
            const isUnlocked = unlocked.includes(a.id);
            const isSecretHidden = a.secret && !isUnlocked;
            const prog = !isUnlocked && a.progress ? a.progress(history) : null;
            const pct = prog ? Math.min(1, prog.done / prog.total) : 0;

            return (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 relative overflow-hidden transition active:scale-95 ${
                  isUnlocked
                    ? "bg-gradient-to-br from-accent/20 to-accent2/20 ring-1 ring-accent/30"
                    : "bg-card2/40"
                }`}
              >
                <div
                  className={`text-2xl mb-1 ${
                    isUnlocked ? "" : "opacity-25 grayscale"
                  }`}
                >
                  {isSecretHidden ? "❓" : a.emoji}
                </div>
                <div
                  className={`text-[9px] text-center leading-tight ${
                    isUnlocked ? "text-slate-200" : "text-muted"
                  }`}
                >
                  {isSecretHidden ? "Секрет" : a.title}
                </div>

                {prog && !a.secret && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20">
                    <div
                      className="h-full bg-accent/60"
                      style={{ width: `${pct * 100}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-center text-[13px] text-accent py-2 mt-2 hover:text-accent/80 transition"
        >
          {expanded ? "Свернуть ▴" : "Показать все ▾"}
        </button>
      </div>

      <AchievementModal
        achievementId={selectedId}
        records={records}
        history={history}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
