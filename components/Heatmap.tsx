"use client";

import { useMemo, useState } from "react";
import type { HistoryEntry } from "@/types";

const WEEKS = 53;
const CELL = 12; // px
const GAP = 3; // px
const COL_W = CELL + GAP;

interface Props {
  history: HistoryEntry[];
}

// Собираем Map: "2025-11-12" → суммарные часы
function buildHoursMap(history: HistoryEntry[]) {
  const map = new Map<string, number>();
  for (const h of history) {
    map.set(h.date, (map.get(h.date) ?? 0) + h.duration);
  }
  return map;
}

// Уровень яркости по часам
function levelFor(hours: number): 0 | 1 | 2 | 3 | 4 {
  if (hours <= 0) return 0;
  if (hours < 4) return 1;
  if (hours < 8) return 2;
  if (hours < 16) return 3;
  return 4;
}

const LEVEL_CLASS: Record<number, string> = {
  0: "fill-[#1a1a24]",
  1: "fill-[#3a2f6e]",
  2: "fill-[#5c4cb8]",
  3: "fill-[#7c5cff]",
  4: "fill-[#00d4a0]",
};

export function Heatmap({ history }: Props) {
  const [hover, setHover] = useState<{
    x: number;
    y: number;
    date: string;
    hours: number;
  } | null>(null);

  const { cells, months, totalHours } = useMemo(() => {
    const hoursMap = buildHoursMap(history);

    // Конец — сегодня. Начало — 53 недели назад, выровнено по понедельнику.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Понедельник текущей недели
    const dayOfWeek = (today.getDay() + 6) % 7; // 0 = Пн
    const mondayThisWeek = new Date(today);
    mondayThisWeek.setDate(today.getDate() - dayOfWeek);

    // Начало — 52 недели назад от этой недели
    const start = new Date(mondayThisWeek);
    start.setDate(mondayThisWeek.getDate() - 52 * 7);

    const cells: {
      x: number;
      y: number;
      date: string;
      hours: number;
      col: number;
      row: number;
    }[] = [];

    const months: { label: string; col: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < WEEKS * 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (d > today) break;

      const col = Math.floor(i / 7);
      const row = i % 7;

      const key = d.toISOString().slice(0, 10);
      const hours = hoursMap.get(key) ?? 0;

      cells.push({
        x: col * COL_W,
        y: row * COL_W,
        date: key,
        hours,
        col,
        row,
      });

      // Метки месяцев в начале колонки
      if (d.getMonth() !== lastMonth && row === 0) {
        lastMonth = d.getMonth();
        months.push({
          label: d.toLocaleDateString("ru-RU", { month: "short" }),
          col,
        });
      }
    }

    const totalHours = history.reduce((s, h) => s + h.duration, 0);
    return { cells, months, totalHours };
  }, [history]);

  const width = WEEKS * COL_W;
  const height = 7 * COL_W + 20; // +20 под метки месяцев

  return (
    <div className="bg-card rounded-2xl p-5 mt-4 border border-white/5 overflow-x-auto">
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="text-[15px] uppercase tracking-wider text-muted font-semibold">
          Активность
        </h2>
        <span className="text-[11px] text-muted tabular-nums">
          {Math.round(totalHours)}ч за год
        </span>
      </div>

      <div className="relative inline-block">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block"
          onMouseLeave={() => setHover(null)}
        >
          {/* Метки месяцев */}
          {months.map((m, i) => (
            <text
              key={i}
              x={m.col * COL_W}
              y={height - 4}
              className="fill-[#8888a0] text-[9px]"
              style={{ fontFamily: "inherit" }}
            >
              {m.label}
            </text>
          ))}

          {/* Клетки */}
          {cells.map((c, i) => {
            const level = levelFor(c.hours);
            return (
              <rect
                key={i}
                x={c.x}
                y={c.y}
                width={CELL}
                height={CELL}
                rx={2.5}
                className={`${LEVEL_CLASS[level]} transition-colors`}
                onMouseEnter={() =>
                  setHover({
                    x: c.x,
                    y: c.y,
                    date: c.date,
                    hours: c.hours,
                  })
                }
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        {hover && (
          <div
            className="absolute pointer-events-none bg-card2 text-[11px] px-2 py-1 rounded-md border border-white/10 whitespace-nowrap z-10"
            style={{
              left: hover.x + CELL / 2,
              top: hover.y - 32,
              transform: "translateX(-50%)",
            }}
          >
            {new Date(hover.date).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {hover.hours > 0 ? `${hover.hours.toFixed(1)}ч` : "нет сессии"}
          </div>
        )}
      </div>

      {/* Легенда */}
      <div className="flex items-center gap-1.5 mt-4 text-[10px] text-muted">
        <span>меньше</span>
        {[0, 1, 2, 3, 4].map((l) => (
          <svg key={l} width={CELL} height={CELL}>
            <rect
              width={CELL}
              height={CELL}
              rx={2.5}
              className={LEVEL_CLASS[l]}
            />
          </svg>
        ))}
        <span>больше</span>
      </div>
    </div>
  );
}
