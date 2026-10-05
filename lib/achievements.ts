import type { HistoryEntry } from "@/types";

export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  description: string;
  /** Проверка: открыто ли */
  check: (history: HistoryEntry[]) => boolean;
  /** Для незакрытых — прогресс 0..1 + текст «3/7» */
  progress?: (history: HistoryEntry[]) => { done: number; total: number };
}

// ==== утилиты ====
const totalHours = (h: HistoryEntry[]) => h.reduce((s, x) => s + x.duration, 0);
const maxSession = (h: HistoryEntry[]) =>
  h.length ? Math.max(...h.map((x) => x.duration)) : 0;
const sessionCount = (h: HistoryEntry[]) => h.length;

/** Кол-во дней подряд с сессией, начиная с сегодня (или вчера) */
function currentStreak(history: HistoryEntry[]): number {
  const days = new Set(history.map((h) => h.date));
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 3650; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) streak++;
    else if (i > 0) break;
  }
  return streak;
}

/** Самый длинный стрик за всё время */
function bestStreak(history: HistoryEntry[]): number {
  const days = [...new Set(history.map((h) => h.date))].sort();
  if (!days.length) return 0;
  let best = 1;
  let cur = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const next = new Date(days[i]);
    const diff = (next.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) cur++;
    else {
      best = Math.max(best, cur);
      cur = 1;
    }
  }
  return Math.max(best, cur);
}

/** Кол-во сессий с планом N часов (или больше) */
const sessionsWithPlan = (h: HistoryEntry[], hours: number) =>
  h.filter((x) => x.planned >= hours).length;

// ==== Список достижений ====
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    emoji: "🥇",
    title: "Первый шаг",
    description: "Заверши первую сессию голодания",
    check: (h) => sessionCount(h) >= 1,
  },
  {
    id: "three-days",
    emoji: "🌱",
    title: "Разгон",
    description: "Заверши 3 сессии",
    check: (h) => sessionCount(h) >= 3,
    progress: (h) => ({ done: Math.min(sessionCount(h), 3), total: 3 }),
  },
  {
    id: "ten-sessions",
    emoji: "🔟",
    title: "Десятка",
    description: "Заверши 10 сессий",
    check: (h) => sessionCount(h) >= 10,
    progress: (h) => ({ done: Math.min(sessionCount(h), 10), total: 10 }),
  },
  {
    id: "16h",
    emoji: "⚡",
    title: "Классика",
    description: "Дойди до 16 часов за одну сессию",
    check: (h) => maxSession(h) >= 16,
    progress: (h) => ({
      done: Math.min(Math.floor(maxSession(h)), 16),
      total: 16,
    }),
  },
  {
    id: "18h",
    emoji: "🧠",
    title: "Аутофагия",
    description: "Дойди до 18 часов",
    check: (h) => maxSession(h) >= 18,
    progress: (h) => ({
      done: Math.min(Math.floor(maxSession(h)), 18),
      total: 18,
    }),
  },
  {
    id: "20h",
    emoji: "🚀",
    title: "Воин",
    description: "Дойди до 20 часов",
    check: (h) => maxSession(h) >= 20,
    progress: (h) => ({
      done: Math.min(Math.floor(maxSession(h)), 20),
      total: 20,
    }),
  },
  {
    id: "24h",
    emoji: "💎",
    title: "Монах",
    description: "Полные сутки голодания",
    check: (h) => maxSession(h) >= 24,
    progress: (h) => ({
      done: Math.min(Math.floor(maxSession(h)), 24),
      total: 24,
    }),
  },
  {
    id: "streak-3",
    emoji: "🔥",
    title: "Три подряд",
    description: "3 дня подряд с сессией",
    check: (h) => bestStreak(h) >= 3,
    progress: (h) => ({
      done: Math.min(bestStreak(h), 3),
      total: 3,
    }),
  },
  {
    id: "streak-7",
    emoji: "🗓️",
    title: "Неделя",
    description: "7 дней подряд",
    check: (h) => bestStreak(h) >= 7,
    progress: (h) => ({
      done: Math.min(bestStreak(h), 7),
      total: 7,
    }),
  },
  {
    id: "streak-30",
    emoji: "🏅",
    title: "Месяц",
    description: "30 дней подряд",
    check: (h) => bestStreak(h) >= 30,
    progress: (h) => ({
      done: Math.min(bestStreak(h), 30),
      total: 30,
    }),
  },
  {
    id: "total-50",
    emoji: "📊",
    title: "Пятьдесят",
    description: "50 часов суммарно",
    check: (h) => totalHours(h) >= 50,
    progress: (h) => ({
      done: Math.min(Math.floor(totalHours(h)), 50),
      total: 50,
    }),
  },
  {
    id: "total-100",
    emoji: "💯",
    title: "Сотня",
    description: "100 часов суммарно",
    check: (h) => totalHours(h) >= 100,
    progress: (h) => ({
      done: Math.min(Math.floor(totalHours(h)), 100),
      total: 100,
    }),
  },
  {
    id: "total-500",
    emoji: "🏔️",
    title: "Марафон",
    description: "500 часов суммарно",
    check: (h) => totalHours(h) >= 500,
    progress: (h) => ({
      done: Math.min(Math.floor(totalHours(h)), 500),
      total: 500,
    }),
  },
  {
    id: "total-1000",
    emoji: "🌟",
    title: "Легенда",
    description: "1000 часов суммарно",
    check: (h) => totalHours(h) >= 1000,
    progress: (h) => ({
      done: Math.min(Math.floor(totalHours(h)), 1000),
      total: 1000,
    }),
  },
];

export function getUnlockedIds(history: HistoryEntry[]): string[] {
  return ACHIEVEMENTS.filter((a) => a.check(history)).map((a) => a.id);
}
