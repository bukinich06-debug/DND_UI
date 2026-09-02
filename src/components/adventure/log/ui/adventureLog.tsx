"use client";

import { useTranslations } from "next-intl";
import type { ILogEntry } from "@/components/shared/types";
import { useLogScroll } from "../hooks/useLogScroll";
import { LogEntry } from "../log-entry";

interface IAdventureLogProps {
  entries: ILogEntry[];
  sending: boolean;
}

export const AdventureLog = ({ entries, sending }: IAdventureLogProps) => {
  const t = useTranslations("center");
  const logRef = useLogScroll(entries.length, sending);

  return (
    <div ref={logRef} className="scrollable flex-1 px-12 pt-8 pb-4">
      {entries.map((entry) => (
        <LogEntry key={entry.id} entry={entry} />
      ))}
      {sending && (
        <div className="flex items-center gap-2 pb-2">
          <div className="size-1.5 bg-accent opacity-60" />
          <span className="font-sans text-[13px] text-muted italic">{t("thinking")}</span>
        </div>
      )}
    </div>
  );
};
