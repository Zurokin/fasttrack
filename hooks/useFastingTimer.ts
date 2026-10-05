"use client";

import { useEffect, useState } from "react";
import type { Phase, Session } from "@/types";
import { PLANS } from "@/lib/plans";

interface TimerState {
  phase: Phase;
  remainingMs: number;
  progress: number;
  elapsedHours: number; // ← НОВОЕ
}

export function useFastingTimer(session: Session | null): TimerState {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    const onVisible = () => !document.hidden && setNow(Date.now());
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [session]);

  if (!session) {
    return { phase: "fasting", remainingMs: 0, progress: 0, elapsedHours: 0 };
  }

  const elapsed = now - session.startTime;
  const elapsedHours = elapsed / 3600_000;
  const fastMs = session.planHours * 3600_000;
  const eatMs = (PLANS[session.planHours]?.eat ?? 8) * 3600_000;

  if (elapsed < fastMs) {
    return {
      phase: "fasting",
      remainingMs: fastMs - elapsed,
      progress: elapsed / fastMs,
      elapsedHours,
    };
  }

  const eatElapsed = elapsed - fastMs;
  if (eatElapsed < eatMs) {
    return {
      phase: "eating",
      remainingMs: eatMs - eatElapsed,
      progress: 1,
      elapsedHours,
    };
  }

  return { phase: "done", remainingMs: 0, progress: 1, elapsedHours };
}
