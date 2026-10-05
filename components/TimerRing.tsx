"use client";

import { formatDuration } from "@/lib/plans";
import type { Phase } from "@/types";

interface Props {
  phase: Phase;
  remainingMs: number;
  progress: number;
}

const RADIUS = 108;
const CIRC = 2 * Math.PI * RADIUS;

const PHASE_META: Record<
  Phase,
  { label: string; badge: string; badgeClass: string }
> = {
  fasting: {
    label: "до конца голодания",
    badge: "ГОЛОДАНИЕ",
    badgeClass: "bg-accent/20 text-[#a48cff]",
  },
  eating: {
    label: "окно питания",
    badge: "ЕДА",
    badgeClass: "bg-accent2/20 text-accent2",
  },
  done: {
    label: "цикл завершён",
    badge: "ГОТОВО",
    badgeClass: "bg-accent2/20 text-accent2",
  },
};

export function TimerRing({ phase, remainingMs, progress }: Props) {
  const meta = PHASE_META[phase];
  const offset = CIRC * (1 - progress);

  return (
    <div className="flex flex-col items-center py-7 px-5">
      <div
        className={`inline-block px-3.5 py-1.5 rounded-full text-[13px] font-semibold mb-3 ${meta.badgeClass}`}
      >
        {meta.badge}
      </div>

      <div className="relative w-60 h-60 mb-5">
        <svg
          width="240"
          height="240"
          viewBox="0 0 240 240"
          className="-rotate-90"
        >
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7c5cff" />
              <stop offset="100%" stopColor="#00d4a0" />
            </linearGradient>
          </defs>
          <circle
            cx="120"
            cy="120"
            r={RADIUS}
            fill="none"
            stroke="#24243a"
            strokeWidth="12"
          />
          <circle
            cx="120"
            cy="120"
            r={RADIUS}
            fill="none"
            stroke="url(#grad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[44px] font-bold tabular-nums tracking-tight">
            {formatDuration(remainingMs)}
          </div>
          <div className="text-[13px] text-muted mt-1 uppercase tracking-wider">
            {meta.label}
          </div>
        </div>
      </div>
    </div>
  );
}
