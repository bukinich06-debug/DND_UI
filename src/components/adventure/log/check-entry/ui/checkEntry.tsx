"use client";

import { useTranslations } from "next-intl";
import type { ICheckEntry } from "@/components/shared/types";
import { IconDice } from "@/components/shared/icon";

interface ICheckEntryProps {
  entry: ICheckEntry;
  onRoll: () => void;
  rolling: boolean;
}

export const CheckEntry = ({ entry, onRoll, rolling }: ICheckEntryProps) => {
  const t = useTranslations("center");
  const bonus = entry.bonus >= 0 ? `+${entry.bonus}` : `${entry.bonus}`;
  const rolled = entry.d20 !== undefined;

  return (
    <div className="mb-5 flex items-center gap-2.5 border border-border bg-[#142014] px-3 py-2">
      <span className="text-system">
        <IconDice />
      </span>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="font-mono text-[13px] font-medium text-system">{entry.skillLabel}</span>
        <span className="font-mono text-[13px] text-foreground-dim">{t("checkDc", { dc: entry.dc })}</span>
        {rolled && (
          <span className="font-mono text-[13px] text-foreground-dim">
            {entry.d20}
            {bonus} = {entry.total}
          </span>
        )}
        {rolled && (
          <span className="font-sans text-[13px] font-medium text-hp">
            {entry.passed ? t("checkSuccess") : t("checkFailure")}
          </span>
        )}
        {!rolled && (
          <button
            type="button"
            onClick={onRoll}
            disabled={rolling}
            className="cursor-pointer border border-border bg-panel px-2.5 py-1 font-sans text-[13px] font-medium text-foreground hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t("checkRoll", { skill: entry.skillLabel, bonus, dc: entry.dc })}
          </button>
        )}
      </div>
    </div>
  );
};
