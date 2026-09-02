"use client";

import { useTranslations } from "next-intl";
import type { IPlayerEntry } from "@/components/shared/types";

interface IPlayerEntryProps {
  entry: IPlayerEntry;
}

export const PlayerEntry = ({ entry }: IPlayerEntryProps) => {
  const t = useTranslations("center");

  if (!entry.do && !entry.say) return null;

  return (
    <div className="mb-5 border border-border bg-panel px-3.5 py-3">
      <div className="mb-1.5 font-sans text-xs uppercase tracking-wide text-muted">{t("yourAction")}</div>
      {entry.do && <p className="m-0 font-sans text-[15px] leading-[1.5] text-foreground">{entry.do}</p>}
      {entry.say && (
        <p className={`m-0 font-sans text-[15px] leading-[1.5] text-foreground italic ${entry.do ? "mt-1.5" : ""}`}>
          &ldquo;{entry.say}&rdquo;
        </p>
      )}
    </div>
  );
};
