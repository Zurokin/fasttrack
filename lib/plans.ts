import type { Plan } from "@/types";

export const PLANS: Record<number, Plan> = {
  14: { fast: 14, eat: 10, label: "Мягкий" },
  16: { fast: 16, eat: 8, label: "Классика" },
  18: { fast: 18, eat: 6, label: "Продвинутый" },
  20: { fast: 20, eat: 4, label: "Воин" },
  24: { fast: 24, eat: 24, label: "OMAD" },
  36: { fast: 36, eat: 12, label: "Монах" },
};

export const formatDuration = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

export const formatHours = (h: number) => `${h.toFixed(1)}ч`;

export const declOfNum = (n: number, forms: [string, string, string]) => {
  const a = Math.abs(n) % 100;
  const a1 = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (a1 > 1 && a1 < 5) return forms[1];
  if (a1 === 1) return forms[0];
  return forms[2];
};
