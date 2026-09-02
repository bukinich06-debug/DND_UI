"use client";

import { useTranslations } from "next-intl";
import type { ICheckEntry } from "@/components/shared/types";
import { IconDice } from "@/components/shared/icon";

interface ICheckEntryProps {
  entry: ICheckEntry;
}

export const CheckEntry = ({ entry }: ICheckEntryProps) => {
  const t = useTranslations("center");
  const resultLabel = entry.result === "success" ? t("checkSuccess") : t("checkFailure");

  return (
    <div className="mb-5 flex items-center gap-2.5 border border-border bg-[#142014] px-3 py-2">
      <span className="text-system">
        <IconDice />
      </span>
      <div>
        <span className="font-mono text-[13px] font-medium text-system">{entry.skill}</span>
        <span className="ml-2.5 font-mono text-[13px] text-foreground-dim">{entry.roll}</span>
        <span className="ml-2.5 font-sans text-[13px] font-medium text-hp">{resultLabel}</span>
      </div>
    </div>
  );
};
