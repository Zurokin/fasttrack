"use client";

import { ACHIEVEMENTS } from "@/lib/achievements";

export function AchievementToast({ ids }: { ids: string[] }) {
  if (ids.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none">
      {ids.map((id) => {
        const a = ACHIEVEMENTS.find((x) => x.id === id);
        if (!a) return null;
        return (
          <div
            key={id}
            className="bg-gradient-to-br from-accent to-accent2 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-[slideUp_0.4s_ease-out] min-w-[280px]"
          >
            <div className="text-3xl">{a.emoji}</div>
            <div className="flex-1">
              <div className="text-[11px] uppercase tracking-wider opacity-80">
                Достижение открыто
              </div>
              <div className="font-bold text-sm">{a.title}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
