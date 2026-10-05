"use client";

import { declOfNum } from "@/lib/plans";

export function Header({ streak }: { streak: number }) {
  return (
    <header className="flex items-center justify-between mb-5">
      <h1 className="text-2xl font-bold tracking-tight">
        Fast<span className="text-accent">Track</span>
      </h1>
      <div className="text-[13px] text-muted bg-card px-3 py-1.5 rounded-full">
        🔥 {streak} {declOfNum(streak, ["день", "дня", "дней"])}
      </div>
    </header>
  );
}
