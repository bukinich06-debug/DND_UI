"use client"

import { useTranslations } from "next-intl"
import {
  IconAction,
  IconBonusAction,
  IconReaction,
  IconMovement,
} from "@/components/shared/icon"
import type { ICombatant } from "../../types"

interface IActionEconomyBarProps {
  playerCombatant: ICombatant | null
  isPlayerTurn: boolean
}

export const ActionEconomyBar = ({
  playerCombatant,
  isPlayerTurn,
}: IActionEconomyBarProps) => {
  const t = useTranslations("combat.actionEconomy")

  if (!playerCombatant) return null

  const movementRemaining = Math.max(
    0,
    playerCombatant.speed - playerCombatant.movementUsedFeet,
  )

  const getActionClasses = (used: boolean) => {
    if (!isPlayerTurn && !used)
      return "text-muted/40"
    if (used) return "text-muted/40"
    return "text-accent"
  }

  const getActionTitle = (used: boolean) =>
    used ? t("spent") : t("available")

  return (
    <div className="mb-4 rounded border border-border bg-panel-alt p-3">
      <div className="mb-3 flex items-center justify-between">
        <div
          className={`flex items-center gap-1.5 ${getActionClasses(playerCombatant.actionUsed)}`}
          title={getActionTitle(playerCombatant.actionUsed)}
        >
          <IconAction />
          <span className="font-sans text-xs font-semibold">
            {t("action")}
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 ${getActionClasses(playerCombatant.bonusActionUsed)}`}
          title={getActionTitle(playerCombatant.bonusActionUsed)}
        >
          <IconBonusAction />
          <span className="font-sans text-xs font-semibold">
            {t("bonusAction")}
          </span>
        </div>

        <div
          className={`flex items-center gap-1.5 ${getActionClasses(playerCombatant.reactionUsed)}`}
          title={getActionTitle(playerCombatant.reactionUsed)}
        >
          <IconReaction />
          <span className="font-sans text-xs font-semibold">
            {t("reaction")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-foreground">
          <IconMovement />
          <span className="font-sans text-xs font-semibold">
            {t("movement")}
          </span>
        </div>
        <div className="flex-1">
          <div className="relative h-4 overflow-hidden rounded border border-border bg-panel">
            <div
              className="h-full bg-accent/60 transition-all"
              style={{
                width: `${(movementRemaining / playerCombatant.speed) * 100}%`,
              }}
            />
          </div>
        </div>
        <span className="font-sans text-xs text-muted">
          {movementRemaining}/{playerCombatant.speed} {t("feet")}
        </span>
      </div>

      {!isPlayerTurn && (
        <div className="mt-2 font-sans text-xs text-muted">{t("notYourTurn")}</div>
      )}
    </div>
  )
}
