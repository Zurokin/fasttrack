"use client";

import { PLANS } from "@/lib/plans";

interface Props {
  active: number;
  onChange: (hours: number) => void;
  disabled?: boolean;
}

export function PlanSelector({ active, onChange, disabled }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {Object.entries(PLANS).map(([key, plan]) => {
        const hours = Number(key);
        const isActive = hours === active;
        return (
          <button
            key={key}
            disabled={disabled}
            onClick={() => onChange(hours)}
            className={`rounded-2xl py-3.5 px-2 text-center transition border-[1.5px] ${
              isActive
                ? "border-accent bg-accent/10"
                : "border-transparent bg-card hover:bg-card2"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <div className="text-[17px] font-bold">
              {plan.fast}:{plan.eat}
            </div>
            <div className="text-[11px] text-muted mt-0.5">{plan.label}</div>
          </button>
        );
      })}
    </div>
  );
}
