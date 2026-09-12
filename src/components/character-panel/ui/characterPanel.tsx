"use client"

import type { ReactNode } from "react"
import { useTranslations } from "next-intl"
import { AbilityCard } from "../ability-card"
import { BarStat } from "@/components/shared/bar-stat"
import {
  IconHeart,
  IconShield,
  IconStar,
  IconSword,
  IconUser,
} from "@/components/shared/icon"
import { Purse } from "@/components/shared/purse"
import type { TabId } from "@/components/shared/types"
import { abilityMod, formatBonus } from "../helpers/abilityMod"
import { xpToNext } from "../helpers/xpToNext"
import { usePlayer } from "../hooks/usePlayer"
import type { ICharacterPanelProps } from "../types"

const TAB_IDS: TabId[] = ["character", "spells", "journal"]

export const CharacterPanel = ({
  onInventory,
  activeTab,
  setActiveTab,
}: ICharacterPanelProps) => {
  const t = useTranslations("character")
  const tNav = useTranslations("nav")
  const player = usePlayer()

  const tabs = (
    <div className="border-t border-border px-4 py-3">
      <div className="grid grid-cols-2 gap-1.5">
        {TAB_IDS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer border py-[7px] font-sans text-sm transition-all ${
              activeTab === tab
                ? "border-accent bg-panel-alt text-foreground"
                : "border-border bg-transparent text-muted"
            }`}
          >
            {tNav(tab)}
          </button>
        ))}
        <button
          type="button"
          onClick={onInventory}
          className="cursor-pointer border border-border bg-transparent py-[7px] font-sans text-sm text-muted"
        >
          {tNav("inventory")}
        </button>
      </div>
    </div>
  )

  if (!player)
    return (
      <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-background">
        <div className="flex-1" />
        {tabs}
      </aside>
    )

  const classLabel = player.subclass
    ? `${player.className} (${player.subclass})`
    : player.className
  const init = player.initiativeBonus ?? abilityMod(player.dex)

  let portrait: ReactNode = (
    <div className="flex size-[52px] shrink-0 items-center justify-center border-[1.5px] border-border-light bg-panel-alt text-muted">
      <IconUser />
    </div>
  )
  if (player.portraitUrl)
    portrait = (
      <img
        src={player.portraitUrl}
        alt={player.name}
        className="size-[52px] shrink-0 border-[1.5px] border-border-light object-cover"
      />
    )

  let inspiration: ReactNode = null
  if (player.inspiration)
    inspiration = (
      <div className="mt-0.5 flex items-center gap-1">
        <span className="text-accent">
          <IconStar />
        </span>
      </div>
    )

  let xpBar: ReactNode = null
  if (player.xp !== null)
    xpBar = (
      <BarStat
        label={t("xp")}
        current={player.xp}
        max={xpToNext(player.level)}
        color="#5a7fc9"
      />
    )

  let conditions: ReactNode = null
  if (player.conditions.length > 0)
    conditions = (
      <div className="flex flex-wrap gap-2">
        {player.conditions.map((condition) => (
          <span
            key={condition}
            className="border border-border bg-panel-alt px-2 py-0.5 text-[13px] text-hp"
          >
            {condition}
          </span>
        ))}
      </div>
    )

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-background">
      <div className="border-b border-border px-4 pb-4 pt-5">
        <div className="flex items-center gap-3">
          {portrait}
          <div className="flex flex-col gap-0.5">
            <span className="font-sans text-xl font-bold uppercase leading-tight text-foreground">
              {player.name}
            </span>
            <span className="font-sans text-xs text-muted">
              {t("classLevel", { className: classLabel, level: player.level })}
            </span>
            {inspiration}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-border px-4 py-3.5">
        <BarStat
          label={t("hp")}
          current={player.hpCurrent}
          max={player.hpMax}
          color="#5cb85c"
          icon={<IconHeart />}
        />
        {xpBar}

        <div className="mt-1 flex gap-3">
          <div className="flex-1 border border-border bg-panel p-2 text-center">
            <div className="font-sans text-[11px] uppercase tracking-widest text-muted">
              {t("ac")}
            </div>
            <div className="font-mono text-lg font-medium text-foreground">
              {player.ac}
            </div>
          </div>
          <div className="flex-1 border border-border bg-panel p-2 text-center">
            <div className="font-sans text-[11px] uppercase tracking-widest text-muted">
              {t("prof")}
            </div>
            <div className="font-mono text-lg font-medium text-foreground">
              {formatBonus(player.proficiencyBonus)}
            </div>
          </div>
          <div className="flex-1 border border-border bg-panel p-2 text-center">
            <div className="font-sans text-[11px] uppercase tracking-widest text-muted">
              {t("init")}
            </div>
            <div className="font-mono text-lg font-medium text-foreground">
              {formatBonus(init)}
            </div>
          </div>
        </div>

        <div className="mt-1">
          <div className="mb-1 font-sans text-xs uppercase tracking-widest text-muted">
            {t("purse")}
          </div>
          <Purse className="font-mono text-[13px] text-foreground-dim" />
        </div>
      </div>

      <div className="border-b border-border px-4 py-3.5">
        <div className="mb-2 font-sans text-xs uppercase tracking-widest text-muted">
          {t("abilityScores")}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <AbilityCard name={t("abilities.str")} score={player.str} />
          <AbilityCard name={t("abilities.dex")} score={player.dex} />
          <AbilityCard name={t("abilities.con")} score={player.con} />
          <AbilityCard name={t("abilities.int")} score={player.int} />
          <AbilityCard name={t("abilities.wis")} score={player.wis} />
          <AbilityCard name={t("abilities.cha")} score={player.cha} />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b border-border px-4 py-3.5">
        <div className="mb-0.5 font-sans text-xs uppercase tracking-widest text-muted">
          {t("equipment")}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent">
            <IconSword />
          </span>
          <div>
            <div className="font-sans text-[13px] text-foreground">
              {t("equipped.longbow")}
            </div>
            <div className="text-[13px] text-muted">
              {t("equipped.longbowSub")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-accent">
            <IconShield />
          </span>
          <div>
            <div className="font-sans text-[13px] text-foreground">
              {t("equipped.leatherArmor")}
            </div>
            <div className="text-[13px] text-muted">
              {t("equipped.leatherArmorSub")}
            </div>
          </div>
        </div>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span className="border border-border bg-panel-alt px-2 py-0.5 font-sans text-[13px] text-muted">
            {t("tags.quiver", { count: 20 })}
          </span>
          <span className="border border-border bg-panel-alt px-2 py-0.5 font-sans text-[13px] text-muted">
            {t("tags.potion", { count: 3 })}
          </span>
          <span className="border border-border bg-panel-alt px-2 py-0.5 font-sans text-[13px] text-muted">
            {t("tags.rope")}
          </span>
        </div>
      </div>

      <div className="border-b border-border px-4 py-2.5">
        <div className="mb-1.5 font-sans text-xs uppercase tracking-widest text-muted">
          {t("conditions")}
        </div>
        {conditions}
      </div>

      <div className="flex-1" />

      {tabs}
    </aside>
  )
}
