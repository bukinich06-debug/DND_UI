"use client";

import { useNearby } from "../hooks/useNearby";

export const NearbyList = () => {
  const nearby = useNearby();

  return (
    <div className="flex flex-col gap-1">
      {nearby.map((n) => (
        <button
          key={n.label}
          type="button"
          className="flex w-full cursor-pointer items-center gap-2 rounded border border-transparent bg-transparent px-1.5 py-1 text-left hover:border-border hover:bg-panel"
        >
          <span className="shrink-0 text-sm">{n.icon}</span>
          <div>
            <div className="font-sans text-[13px] text-foreground">{n.label}</div>
            <div className="text-[11px] text-muted">{n.sub}</div>
          </div>
        </button>
      ))}
    </div>
  );
};
