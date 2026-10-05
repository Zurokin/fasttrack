"use client";

import { getCurrentPhase } from "@/lib/phases";

export function PhaseCard({ elapsedHours }: { elapsedHours: number }) {
  const phase = getCurrentPhase(elapsedHours);
  const progressInPhase = Math.min(
    1,
    Math.max(
      0,
      (elapsedHours - phase.minHour) /
        (Math.min(phase.maxHour, 999) - phase.minHour),
    ),
  );

  return (
    <div className="bg-card rounded-2xl p-5 mt-4 border border-white/5">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-3xl leading-none">{phase.emoji}</div>
        <div className="flex-1">
          <div className={`text-sm font-bold ${phase.accent}`}>
            {phase.title}
          </div>
          <div className="text-xs text-muted mt-0.5">{phase.short}</div>
        </div>
        <div className="text-[11px] text-muted tabular-nums">
          {phase.minHour}–{Number.isFinite(phase.maxHour) ? phase.maxHour : "∞"}
          ч
        </div>
      </div>

      {/* прогресс внутри фазы */}
      <div className="h-1 bg-card2 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent2 transition-all"
          style={{ width: `${progressInPhase * 100}%` }}
        />
      </div>

      <p className="text-[13px] text-muted leading-relaxed">{phase.detail}</p>
    </div>
  );
}
