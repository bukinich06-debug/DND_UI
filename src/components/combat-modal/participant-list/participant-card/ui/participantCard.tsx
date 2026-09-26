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

  const isPlayer = combatant.type === "player"
  const isUnconscious = isPlayer && combatant.hp === 0 && !combatant.isStable && !combatant.dead
  const isStable = isPlayer && combatant.isStable
  const isDead = isPlayer && combatant.dead

  let statusLabel = null
  let statusColor = ""

  if (isDead) {
    statusLabel = t("dead")
    statusColor = "text-red-500"
  } else if (isStable) {
    statusLabel = t("stable")
    statusColor = "text-yellow-500"
  } else if (isUnconscious) {
    statusLabel = t("unconscious")
    statusColor = "text-orange-500"
  }

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

      {statusLabel && (
        <div className={`mb-2 font-sans text-xs font-semibold ${statusColor}`}>
          {statusLabel}
        </div>
      )}

      {isUnconscious && (
        <div className="mb-2 border-t border-border pt-2">
          <div className="mb-1 font-sans text-xs font-semibold text-muted">
            {t("deathSaves")}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <div className="font-mono text-[10px] text-muted">
                {t("successes")}
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={`success-${i}`}
                    className={`h-3 w-3 rounded-full border ${
                      i < (combatant.deathSaveSuccess ?? 0)
                        ? "border-green-500 bg-green-500"
                        : "border-gray-600 bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="font-mono text-[10px] text-muted">
                {t("failures")}
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={`fail-${i}`}
                    className={`h-3 w-3 rounded-full border ${
                      i < (combatant.deathSaveFail ?? 0)
                        ? "border-red-500 bg-red-500"
                        : "border-gray-600 bg-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="font-mono text-xs text-muted">{distanceLabel}</div>
    </div>
  )
}
