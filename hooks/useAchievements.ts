"use client";

import { useEffect, useRef, useState } from "react";
import type { HistoryEntry } from "@/types";
import { ACHIEVEMENTS, getUnlockedIds } from "@/lib/achievements";
import { useLocalStorage } from "./useLocalStorage";

export function useAchievements(history: HistoryEntry[]) {
  const [seenIds, setSeenIds] = useLocalStorage<string[]>("ft.seen-ach", []);
  const [justUnlocked, setJustUnlocked] = useState<string[]>([]);
  const firstRun = useRef(true);

  useEffect(() => {
    const unlockedNow = getUnlockedIds(history);
    const newIds = unlockedNow.filter((id) => !seenIds.includes(id));

    if (newIds.length > 0) {
      // при первом рендере не показываем тосты за прошлые заслуги
      if (!firstRun.current) {
        setJustUnlocked(newIds);
        // авто-скрытие через 5 секунд
        setTimeout(() => setJustUnlocked([]), 5000);
      }
      setSeenIds([...seenIds, ...newIds]);
    }

    firstRun.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  const unlocked = getUnlockedIds(history);
  return { unlocked, justUnlocked, all: ACHIEVEMENTS };
}
