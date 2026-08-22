import type { ReactNode } from "react";

interface IBarStatProps {
  label: string;
  current: number;
  max: number;
  color: string;
  icon?: ReactNode;
}

export const BarStat = ({ label, current, max, color, icon }: IBarStatProps) => {
  const pct = Math.min(100, (current / max) * 100);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 font-sans text-[11px] uppercase tracking-wider text-muted">
          {icon && <span style={{ color }}>{icon}</span>}
          {label}
        </span>
        <span className="font-mono text-[11px] text-foreground-dim">
          {current}
          <span className="text-muted">/{max}</span>
        </span>
      </div>
      <div className="h-[5px] overflow-hidden rounded-[2px] bg-border">
        <div
          className="h-full rounded-[2px] transition-[width] duration-300"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};
