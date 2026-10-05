"use client";

interface Props {
  totalHours: number;
  sessions: number;
}

export function StatsGrid({ totalHours, sessions }: Props) {
  const stats = [
    { value: Math.round(totalHours), label: "Всего часов" },
    { value: sessions, label: "Сессий" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s, i) => (
        <div key={i} className="bg-card rounded-2xl p-4">
          <div className="text-[22px] font-bold">{s.value}</div>
          <div className="text-xs text-muted mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
