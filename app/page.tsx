"use client";

import { useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { PlanSelector } from "@/components/PlanSelector";
import { TimerRing } from "@/components/TimerRing";
import { StatsGrid } from "@/components/StatsGrid";
import { HistoryList } from "@/components/HistoryList";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useFastingTimer } from "@/hooks/useFastingTimer";
import type { HistoryEntry, Session } from "@/types";
import { PhaseCard } from "@/components/PhaseCard";
import { PhaseTimeline } from "@/components/PhaseTimeline";

export default function Home() {
  const [activePlan, setActivePlan] = useLocalStorage<number>("ft.plan", 16);
  const [session, setSession] = useLocalStorage<Session | null>(
    "ft.session",
    null,
  );
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    "ft.history",
    [],
  );

  const { phase, remainingMs, progress, elapsedHours } =
    useFastingTimer(session);
  const totalHours = history.reduce((sum, h) => sum + h.duration, 0);

  // Уведомление об окончании голодания
  useEffect(() => {
    if (!session || session.notified) return;
    if (Date.now() - session.startTime >= session.planHours * 3600_000) {
      setSession({ ...session, notified: true });
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("🍽️ Голодание завершено!", {
          body: `Ты продержался ${session.planHours} часов. Можно есть!`,
        });
      }
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
  }, [session, remainingMs, setSession]);

  const start = () => {
    setSession({
      startTime: Date.now(),
      planHours: activePlan,
      notified: false,
    });
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const cancel = () => {
    if (!session) return;
    const elapsedH = (Date.now() - session.startTime) / 3600_000;

    if (elapsedH < 0.05) {
      setSession(null);
      return;
    }
    if (confirm(`Завершить сессию? Длительность: ${elapsedH.toFixed(1)}ч`)) {
      setHistory(
        [
          {
            date: new Date().toISOString().slice(0, 10),
            planned: session.planHours,
            duration: elapsedH,
            endTime: Date.now(),
          },
          ...history,
        ].slice(0, 100),
      );
      setSession(null);
    }
  };

  const changePlan = (hours: number) => {
    if (session && !confirm("Сменить план? Текущая сессия будет отменена."))
      return;
    if (session) setSession(null);
    setActivePlan(hours);
  };

  const streak = useMemo(() => {
    const days = new Set(history.map((h) => h.date));
    let s = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (days.has(key)) s++;
      else if (i > 0) break;
    }
    return s;
  }, [history]);

  return (
    <div className="min-h-screen p-4 flex justify-center">
      <div className="w-full max-w-md">
        <Header streak={streak} />

        <PlanSelector
          active={activePlan}
          onChange={changePlan}
          disabled={!!session}
        />

        <div className="bg-card rounded-[20px] border border-white/5 mb-4">
          <TimerRing
            phase={phase}
            remainingMs={remainingMs}
            progress={progress}
          />
          {session && <PhaseCard elapsedHours={elapsedHours} />}
          <PhaseTimeline elapsedHours={elapsedHours} />

          <div className="px-6 pb-6">
            {!session ? (
              <button
                onClick={start}
                className="w-full py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-br from-accent to-[#a48cff] shadow-[0_8px_24px_rgba(124,92,255,0.3)] active:scale-[0.98] transition"
              >
                Начать голодание
              </button>
            ) : (
              <button
                onClick={cancel}
                className="w-full py-3.5 rounded-2xl font-semibold text-danger bg-danger/15 active:scale-[0.98] transition"
              >
                Отменить сессию
              </button>
            )}
          </div>
        </div>

        <StatsGrid totalHours={totalHours} sessions={history.length} />
        <HistoryList items={history} />
      </div>
    </div>
  );
}
