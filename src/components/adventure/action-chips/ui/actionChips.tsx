"use client";

import { useTranslations } from "next-intl";
import type { ActionId } from "@/components/shared/types";

const ACTION_IDS: ActionId[] = ["talk", "inspect", "search", "attack", "move", "rest", "stealth"];

interface IActionChipsProps {
  onPick: (label: string) => void;
}

export const ActionChips = ({ onPick }: IActionChipsProps) => {
  const t = useTranslations("center");
  const tActions = useTranslations("actions");

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className="font-sans text-[13px] text-foreground-dim">{t("suggest")}</span>
      {ACTION_IDS.map((id) => {
        const label = tActions(id);
        return (
          <button
            key={id}
            type="button"
            onClick={() => onPick(label)}
            className="cursor-pointer border border-border-light bg-transparent px-[9px] py-[3px] font-sans text-xs text-foreground-dim transition-all hover:border-accent hover:bg-panel hover:text-foreground"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};
