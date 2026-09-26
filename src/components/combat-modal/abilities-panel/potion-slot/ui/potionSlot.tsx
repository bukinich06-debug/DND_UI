"use client"

import { useTranslations } from "next-intl"

interface IPotionSlotProps {
  count: number
  bonusActionUsed: boolean
  isPlayerTurn: boolean
}

export const PotionSlot = ({
  count,
  bonusActionUsed,
  isPlayerTurn,
}: IPotionSlotProps) => {
  const t = useTranslations("combat")

  const handleDrink = () => {
    console.log("TODO: Drink potion")
  }

  const isDisabled = !isPlayerTurn || bonusActionUsed

  return (
    <div className="border border-border bg-panel p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-sans text-sm font-semibold text-foreground">
          {t("healingPotion")}
        </span>
        <span className="font-mono text-xs text-muted">×{count}</span>
      </div>

      <button
        type="button"
        onClick={handleDrink}
        disabled={isDisabled}
        className="w-full cursor-pointer border border-accent bg-accent px-3 py-2 font-sans text-xs font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
        title={
          !isPlayerTurn
            ? t("notYourTurn")
            : bonusActionUsed
              ? t("bonusActionSpent")
              : undefined
        }
      >
        {t("drink")}
      </button>
    </div>
  )
}
