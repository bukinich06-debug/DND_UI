"use client";

import { useTranslations } from "next-intl";
import { BarStat } from "@/components/shared/bar-stat";

export const PartyCard = () => {
  const t = useTranslations("sidebar");
  const tChar = useTranslations("character");

  return (
    <div className="rounded border border-border bg-panel p-2.5">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="font-sans text-[13px] text-foreground">{t("partyName")}</div>
          <div className="text-[11px] text-muted">{t("partyClass", { level: 3 })}</div>
        </div>
        <div className="rounded-[3px] border border-[#3d6040] bg-[#1e2a1e] px-[7px] py-0.5 text-[11px] text-hp">{t("ready")}</div>
      </div>
      <BarStat label={tChar("hp")} current={18} max={22} color="#7ab87a" />
    </div>
  );
};
