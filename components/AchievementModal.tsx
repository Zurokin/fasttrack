"use client";

import type { AchievementRecord, HistoryEntry } from "@/types";
import { ACHIEVEMENTS } from "@/lib/achievements";

interface Props {
  achievementId: string | null;
  records: AchievementRecord[];
  history: HistoryEntry[];
  onClose: () => void;
}

export function AchievementModal({
  achievementId,
  records,
  history,
  onClose,
}: Props) {
  if (!achievementId) return null;

  const a = ACHIEVEMENTS.find((x) => x.id === achievementId);
  if (!a) return null;

  const record = records.find((r) => r.id === achievementId);
  const isUnlocked = !!record;
  const prog = !isUnlocked && a.progress ? a.progress(history) : null;

  const unlockedDate = record
    ? new Date(record.unlockedAt).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-3xl p-6 max-w-sm w-full border border-white/10 shadow-2xl animate-[popIn_0.25s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className={`text-6xl mb-4 ${
              isUnlocked ? "" : "opacity-25 grayscale"
            }`}
          >
            {a.emoji}
          </div>

          <div
            className={`text-xl font-bold mb-1 ${
              isUnlocked ? "text-slate-100" : "text-muted"
            }`}
          >
            {a.title}
          </div>

          {a.secret && !isUnlocked && (
            <div className="text-[11px] uppercase tracking-wider text-accent mb-2">
              🔒 Секретное
            </div>
          )}

          <p className="text-sm text-muted leading-relaxed mb-4">
            {a.description}
          </p>

          {isUnlocked && unlockedDate && (
            <div className="text-xs text-accent2 bg-accent2/10 px-3 py-1.5 rounded-full mb-4">
              ✓ Открыто {unlockedDate}
            </div>
          )}

          {prog && (
            <div className="w-full mb-4">
              <div className="flex justify-between text-[11px] text-muted mb-1.5">
                <span>Прогресс</span>
                <span className="tabular-nums">
                  {prog.done} / {prog.total}
                </span>
              </div>
              <div className="h-1.5 bg-card2 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-accent2 transition-all"
                  style={{
                    width: `${Math.min(100, (prog.done / prog.total) * 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-semibold text-slate-200 bg-card2 hover:bg-card2/70 active:scale-[0.98] transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
