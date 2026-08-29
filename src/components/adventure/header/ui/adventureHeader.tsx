"use client"

import { useTranslations } from "next-intl"
import { IconBook, IconMap, IconSettings } from "@/components/shared/icon"
import { LanguageSwitcher } from "@/components/shared/language-switcher"
import { usePlayerPlace } from "@/components/shared/player-place"

interface IAdventureHeaderProps {
  onWorld: () => void
  locationEpoch: number
}

export const AdventureHeader = ({ onWorld, locationEpoch }: IAdventureHeaderProps) => {
  const t = useTranslations("center")
  const tNav = useTranslations("nav")
  const { name, summary, loading, error } = usePlayerPlace(locationEpoch)

  let title = t("locationEmpty")
  if (loading) title = t("locationLoading")
  else if (error) title = t("locationError")
  else if (name) title = name

  let placeBit = t("locationEmpty")
  if (loading) placeBit = t("locationLoading")
  else if (error) placeBit = t("locationError")
  else if (summary) placeBit = summary

  const situationLine = `${t("situationTime")} · ${t("situationWeather")} · ${placeBit}`

  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-7 py-3.5">
      <div>
        <div className="flex items-center gap-2">
          <h1
            className={`m-0 font-sans text-[28px] font-bold uppercase leading-none ${error ? "text-combat" : "text-foreground"}`}
          >
            {title}
          </h1>
          <span className="flex items-center gap-1.5 border border-border bg-panel px-[9px] py-0.5 font-sans text-[13px] text-muted">
            <span className="inline-block size-1.5 animate-pulse rounded-full bg-system" />
            {t("aiDmActive")}
          </span>
        </div>
        <p className="mt-1 mb-0 font-sans text-[13px] text-muted">{situationLine}</p>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 border border-border bg-transparent px-2.5 py-1.5 font-sans text-sm text-muted hover:border-border-light hover:text-foreground"
        >
          <IconBook /> {tNav("journal")}
        </button>
        <button
          type="button"
          onClick={onWorld}
          className="flex cursor-pointer items-center gap-1.5 border border-border bg-transparent px-2.5 py-1.5 font-sans text-sm text-muted hover:border-border-light hover:text-foreground"
        >
          <IconMap /> {tNav("world")}
        </button>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 border border-border bg-transparent px-2.5 py-1.5 font-sans text-sm text-muted hover:border-border-light hover:text-foreground"
        >
          <IconSettings /> {tNav("settings")}
        </button>
      </div>
    </header>
  )
}
