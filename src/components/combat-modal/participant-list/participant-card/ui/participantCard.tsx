"use client"

import type { ICombatant } from "../../../types"
import { useTranslations } from "next-intl"

interface IParticipantCardProps {
  combatant: ICombatant
}

export const ParticipantCard = ({ combatant }: IParticipantCardProps) => {
  const t = useTranslations("combat")

  const hpPercent = Math.max(
    0,
    Math.min(100, (combatant.hp / combatant.maxHp) * 100),
  )

  const typeLabel = t(`type.${combatant.type}`)
  const distanceLabel =
    combatant.feetFromPlayer !== undefined
      ? t("distance", { feet: combatant.feetFromPlayer })
      : t("distanceUnknown")

  return (
    <div
      className={`border border-border bg-panel-alt p-3 ${
        combatant.isPlayerTurn ? "border-accent" : ""
      }`}
    >
      <div className="mb-2 flex items-start justify-between">
        <div className="flex-1">
          <div className="font-sans text-sm font-semibold text-foreground">
            {combatant.name}
          </div>
          <div className="mt-0.5 font-sans text-xs text-muted">{typeLabel}</div>
        </div>
        {combatant.isPlayerTurn && combatant.type === "player" && (
          <div className="ml-2 font-sans text-xs font-bold uppercase text-accent">
            {t("yourTurn")}
          </div>
        )}
      </div>

      <div className="mb-1 flex items-center justify-between font-mono text-xs">
        <span className="text-muted">{t("hp")}</span>
        <span className="text-foreground">
          {combatant.hp} / {combatant.maxHp}
        </span>
      </div>

      <div className="mb-2 h-1.5 overflow-hidden bg-panel">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${hpPercent}%` }}
        />
      </div>

      <div className="font-mono text-xs text-muted">{distanceLabel}</div>
    </div>
  )
}
