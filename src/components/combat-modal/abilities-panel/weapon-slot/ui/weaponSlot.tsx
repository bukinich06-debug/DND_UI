"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import type { ICombatant, IWeaponSlot } from "../../../types"
import { useWeaponTargets } from "../../../hooks/useWeaponTargets"

interface IWeaponSlotProps {
  weapon: IWeaponSlot
  combatants: ICombatant[]
  playerId: string
}

export const WeaponSlot = ({
  weapon,
  combatants,
  playerId,
}: IWeaponSlotProps) => {
  const t = useTranslations("combat")
  const [selectedTargetId, setSelectedTargetId] = useState("")

  const availableTargets = useWeaponTargets({
    weapon,
    combatants,
    playerId,
  })

  const handleAttack = () => {
    if (!selectedTargetId) return
    console.log(
      `TODO: Attack with ${weapon.name} against target ${selectedTargetId}`,
    )
  }

  return (
    <div className="border border-border bg-panel p-3">
      <div className="mb-2 font-sans text-sm font-semibold text-foreground">
        {weapon.name}
      </div>

      {availableTargets.length === 0 && (
        <p className="m-0 mb-2 font-sans text-xs text-muted">
          {t("noTargets")}
        </p>
      )}

      {availableTargets.length > 0 && (
        <>
          <select
            value={selectedTargetId}
            onChange={(e) => setSelectedTargetId(e.target.value)}
            className="mb-2 w-full border border-border bg-panel-alt p-2 font-sans text-xs text-foreground outline-none"
          >
            <option value="">{t("selectTarget")}</option>
            {availableTargets.map((target) => (
              <option key={target.id} value={target.id}>
                {target.name} ({target.feetFromPlayer} {t("feet")})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleAttack}
            disabled={!selectedTargetId}
            className="w-full cursor-pointer border border-accent bg-accent px-3 py-2 font-sans text-xs font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("attack")}
          </button>
        </>
      )}
    </div>
  )
}
