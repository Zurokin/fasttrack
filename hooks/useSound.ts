"use client";

import { useCallback, useRef } from "react";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export function useAchievementSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    try {
      if (!ctxRef.current) {
        const Ctx = window.AudioContext ?? window.webkitAudioContext;
        if (!Ctx) return;
        ctxRef.current = new Ctx();
      }
      const ctx = ctxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;

      // три ноты: C6, E6, G6 — мажорный аккорд
      const notes = [1046.5, 1318.51, 1567.98];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;

        const start = now + i * 0.06;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.7);
      });
    } catch {
      // звук — не критичная фича, тихо игнорируем ошибки
    }
  }, []);
}
