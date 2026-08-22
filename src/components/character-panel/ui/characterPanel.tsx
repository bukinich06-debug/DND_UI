"use client";

import { useTranslations } from "next-intl";
import { AbilityCard } from "../ability-card";
import { BarStat } from "@/components/shared/bar-stat";
import { IconHeart, IconShield, IconStar, IconSword, IconUser } from "@/components/shared/icon";
import { Purse } from "@/components/shared/purse";
import type { TabId } from "@/components/shared/types";
import type { ICharacterPanelProps } from "../types";

const TAB_IDS: TabId[] = ["character", "spells", "journal"];

export const CharacterPanel = ({ onInventory, activeTab, setActiveTab }: ICharacterPanelProps) => {
  const t = useTranslations("character");
  const tNav = useTranslations("nav");

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-background">
      <div className="border-b border-border px-4 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-border-light bg-panel-alt text-muted">
            <IconUser />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-serif text-xl font-medium leading-tight text-foreground">{t("name")}</span>
            <span className="font-sans text-xs text-gold">{t("classLevel", { level: 3 })}</span>
            <div className="mt-0.5 flex items-center gap-1">
              <span className="text-gold">
                <IconStar />
              </span>
              <span className="text-gold">
                <IconStar />
              </span>
              <span className="text-gold">
                <IconStar />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-border px-4 py-3.5">
        <BarStat label={t("hp")} current={24} max={28} color="#7ab87a" icon={<IconHeart />} />
        <BarStat label={t("xp")} current={640} max={900} color="#5a7fc9" />

        <div className="mt-1 flex gap-3">
          <div className="flex-1 rounded border border-border bg-panel p-2 text-center">
            <div className="font-sans text-[9px] uppercase tracking-widest text-muted">{t("ac")}</div>
            <div className="font-mono text-lg font-medium text-foreground">15</div>
          </div>
          <div className="flex-1 rounded border border-border bg-panel p-2 text-center">
            <div className="font-sans text-[9px] uppercase tracking-widest text-muted">{t("prof")}</div>
            <div className="font-mono text-lg font-medium text-foreground">+2</div>
          </div>
          <div className="flex-1 rounded border border-border bg-panel p-2 text-center">
            <div className="font-sans text-[9px] uppercase tracking-widest text-muted">{t("init")}</div>
            <div className="font-mono text-lg font-medium text-foreground">+3</div>
          </div>
        </div>

        <div className="mt-1">
          <div className="mb-1 font-sans text-[10px] uppercase tracking-widest text-muted">{t("purse")}</div>
          <Purse className="font-mono text-[13px] text-foreground-dim" />
        </div>
      </div>

      <div className="border-b border-border px-4 py-3.5">
        <div className="mb-2 font-sans text-[10px] uppercase tracking-widest text-muted">{t("abilityScores")}</div>
        <div className="grid grid-cols-3 gap-1.5">
          <AbilityCard name={t("abilities.str")} score={12} />
          <AbilityCard name={t("abilities.dex")} score={17} />
          <AbilityCard name={t("abilities.con")} score={13} />
          <AbilityCard name={t("abilities.int")} score={11} />
          <AbilityCard name={t("abilities.wis")} score={14} />
          <AbilityCard name={t("abilities.cha")} score={9} />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b border-border px-4 py-3.5">
        <div className="mb-0.5 font-sans text-[10px] uppercase tracking-widest text-muted">{t("equipment")}</div>
        <div className="flex items-center gap-2">
          <span className="text-gold">
            <IconSword />
          </span>
          <div>
            <div className="font-sans text-[13px] text-foreground">{t("equipped.longbow")}</div>
            <div className="text-[11px] text-muted">{t("equipped.longbowSub")}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gold">
            <IconShield />
          </span>
          <div>
            <div className="font-sans text-[13px] text-foreground">{t("equipped.leatherArmor")}</div>
            <div className="text-[11px] text-muted">{t("equipped.leatherArmorSub")}</div>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span className="rounded-[3px] border border-border bg-panel-alt px-2 py-0.5 font-sans text-[11px] text-muted">
            {t("tags.quiver", { count: 20 })}
          </span>
          <span className="rounded-[3px] border border-border bg-panel-alt px-2 py-0.5 font-sans text-[11px] text-muted">
            {t("tags.potion", { count: 3 })}
          </span>
          <span className="rounded-[3px] border border-border bg-panel-alt px-2 py-0.5 font-sans text-[11px] text-muted">{t("tags.rope")}</span>
        </div>
      </div>

      <div className="border-b border-border px-4 py-2.5">
        <div className="mb-1.5 font-sans text-[10px] uppercase tracking-widest text-muted">{t("conditions")}</div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-[3px] border border-[#3d6040] bg-[#1e2a1e] px-2 py-0.5 text-[11px] text-hp">{t("conditionsList.focused")}</span>
          <span className="rounded-[3px] border border-[#60402e] bg-[#2a1e1a] px-2 py-0.5 text-[11px] text-[#c48060]">{t("conditionsList.wet")}</span>
        </div>
      </div>

      <div className="flex-1" />

      <div className="border-t border-border px-4 py-3">
        <div className="grid grid-cols-2 gap-1.5">
          {TAB_IDS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer rounded border py-[7px] font-sans text-xs transition-all ${
                activeTab === tab ? "border-border-light bg-panel-alt text-gold" : "border-border bg-transparent text-muted"
              }`}
            >
              {tNav(tab)}
            </button>
          ))}
          <button
            type="button"
            onClick={onInventory}
            className="cursor-pointer rounded border border-border bg-transparent py-[7px] font-sans text-xs text-muted"
          >
            {tNav("inventory")}
          </button>
        </div>
      </div>
    </aside>
  );
};
