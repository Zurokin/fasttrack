"use client";

import { useEffect, useRef, useState } from "react";
import type { AchievementRecord, HistoryEntry } from "@/types";
import { ACHIEVEMENTS, getUnlockedIds } from "@/lib/achievements";
import { useLocalStorage } from "./useLocalStorage";

export function useAchievements(history: HistoryEntry[]) {
  const [records, setRecords] = useLocalStorage<AchievementRecord[]>(
    "ft.ach-records",
    [],
  );
  const [justUnlocked, setJustUnlocked] = useState<string[]>([]);
  const firstRun = useRef(true);

  useEffect(() => {
    const unlockedNow = getUnlockedIds(history);
    const knownIds = records.map((r) => r.id);
    const newIds = unlockedNow.filter((id) => !knownIds.includes(id));

    if (newIds.length > 0) {
      const now = Date.now();
      const updated = [
        ...records,
        ...newIds.map((id) => ({ id, unlockedAt: now })),
      ];
      setRecords(updated);

      // тост только если не первый рендер
      if (!firstRun.current) {
        setJustUnlocked(newIds);
        setTimeout(() => setJustUnlocked([]), 5000);
      }
    }

    firstRun.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const unlocked = records.map((r) => r.id);
  return { unlocked, records, justUnlocked, all: ACHIEVEMENTS };
}
