"use client"

import { useTranslations } from "next-intl"
import type { ActionId } from "@/components/shared/types"

const ACTION_IDS: ActionId[] = [
  "free",
  "talk",
  "inspect",
  "search",
  "attack",
  "move",
  "rest",
  "stealth",
]

interface IActionChipsProps {
  selected: ActionId
  onSelect: (id: ActionId) => void
}

export const ActionChips = ({ selected, onSelect }: IActionChipsProps) => {
  const t = useTranslations("center")
  const tActions = useTranslations("actions")

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className="font-sans text-[13px] text-foreground-dim">
        {t("action")}
      </span>
      {ACTION_IDS.map((id) => {
        const active = selected === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              if (active) return
              onSelect(id)
            }}
            className={`cursor-pointer border px-[9px] py-[3px] font-sans text-xs transition-all ${
              active
                ? "border-accent bg-panel text-foreground"
                : "border-border-light bg-transparent text-foreground-dim hover:border-accent hover:bg-panel hover:text-foreground"
            }`}
          >
            {tActions(id)}
          </button>
        )
      })}
    </div>
  )
}
