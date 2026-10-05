"use client";

import { useState } from "react";
import { PHASES, getCurrentPhase } from "@/lib/phases";

export function PhaseTimeline({ elapsedHours }: { elapsedHours: number }) {
  const [showAll, setShowAll] = useState(false);
  const current = getCurrentPhase(elapsedHours);
  const currentIndex = PHASES.indexOf(current);

  const past = PHASES.slice(0, currentIndex);
  const next = PHASES[currentIndex + 1];
  const future = PHASES.slice(currentIndex + 2);

  return (
    <div className="bg-card rounded-2xl p-5 mt-4 border border-white/5">
      <h2 className="text-[15px] uppercase tracking-wider text-muted font-semibold mb-3.5">
        Фазы голодания
      </h2>

      {/* Пройденные — свёрнуто в одну строку */}
      {past.length > 0 && (
        <div className="flex items-center gap-2 py-2 px-3 mb-2 text-[13px] text-muted">
          <span>✅</span>
          <span>
            Пройдено {past.length}{" "}
            {past.length === 1 ? "фаза" : past.length < 5 ? "фазы" : "фаз"}
          </span>
        </div>
      )}

      {/* Текущая — раскрыта */}
      <div className="flex items-start gap-3 py-3 px-3 rounded-xl bg-accent/10 ring-1 ring-accent/40 mb-2">
        <div className="text-2xl leading-none">{current.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-bold ${current.accent}`}>
            {current.title}
            <span className="ml-2 text-[10px] uppercase tracking-wider text-accent">
              сейчас
            </span>
          </div>
          <div className="text-[11px] text-muted tabular-nums mt-0.5">
            {current.minHour}–
            {Number.isFinite(current.maxHour) ? current.maxHour : "∞"}ч
          </div>
          <p className="text-[12px] text-muted leading-relaxed mt-2">
            {current.short}
          </p>
        </div>
      </div>

      {/* Следующая — приглушённая */}
      {next && (
        <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-card2/50 mb-2">
          <div className="text-xl opacity-60">{next.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-slate-300 truncate">
              <span className="text-muted mr-1">Дальше:</span>
              {next.title}
            </div>
            <div className="text-[11px] text-muted tabular-nums">
              {next.minHour}–
              {Number.isFinite(next.maxHour) ? next.maxHour : "∞"}ч
            </div>
          </div>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={() => setShowAll((v) => !v)}
        className="w-full text-center text-[13px] text-accent py-2 mt-1 hover:text-accent/80 transition"
      >
        {showAll ? "Скрыть ▴" : `Показать все фазы (${PHASES.length}) ▾`}
      </button>

      {/* Все фазы — по кнопке */}
      {showAll && (
        <div className="space-y-1 mt-2 pt-2 border-t border-white/5">
          {PHASES.map((p) => {
            const isCurrent = p === current;
            const isPast = elapsedHours >= p.maxHour;
            const isNext = p === next;

            return (
              <div
                key={p.minHour}
                className={`flex items-center gap-3 py-2 px-3 rounded-xl ${
                  isCurrent ? "bg-accent/10" : isNext ? "bg-card2/50" : ""
                }`}
              >
                <div
                  className={`text-lg ${
                    isPast ? "opacity-40" : isCurrent ? "" : "opacity-60"
                  }`}
                >
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[13px] truncate ${
                      isCurrent
                        ? p.accent
                        : isPast
                          ? "text-muted line-through"
                          : "text-slate-300"
                    }`}
                  >
                    {p.title}
                  </div>
                  <div className="text-[10px] text-muted tabular-nums">
                    {p.minHour}–{Number.isFinite(p.maxHour) ? p.maxHour : "∞"}ч
                  </div>
                </div>
                {isCurrent && (
                  <div className="text-[10px] text-accent uppercase tracking-wider">
                    сейчас
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
