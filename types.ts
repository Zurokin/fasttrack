export type Phase = "fasting" | "eating" | "done";

export interface Session {
  startTime: number;
  planHours: number;
  notified: boolean;
}

export interface HistoryEntry {
  date: string; // YYYY-MM-DD
  planned: number; // часы плана
  duration: number; // фактические часы
  endTime: number;
}

export interface Plan {
  fast: number;
  eat: number;
  label: string;
}

export interface AchievementRecord {
  id: string;
  unlockedAt: number;
}
