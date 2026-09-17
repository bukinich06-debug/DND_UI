"use client"

import type { ICombatant, IWeaponSlot } from "../types"

interface IUseWeaponTargetsParams {
  weapon: IWeaponSlot
  combatants: ICombatant[]
  playerId: string
}

const isCombatDebug = () =>
  typeof window !== "undefined" && localStorage.getItem("combatDebug") === "1"

export const useWeaponTargets = ({
  weapon,
  combatants,
  playerId,
}: IUseWeaponTargetsParams): ICombatant[] => {
  const rangeProperty = weapon.properties.find((p) => p.type === "range")

  const maxRange = rangeProperty?.normal ?? 5

  if (isCombatDebug()) {
    console.log("[useWeaponTargets]", weapon.name)
    console.log("  rangeProperty:", rangeProperty)
    console.log("  maxRange:", maxRange)
    console.log(
      "  combatants distances:",
      combatants.map((c) => `${c.name}: ${c.feetFromPlayer}ft`),
    )
  }

  const targets = combatants.filter((c) => {
    if (c.id === playerId) return false
    if (c.type !== "monster" && c.type !== "npc") return false
    if (c.feetFromPlayer === undefined) return false
    if (c.feetFromPlayer > maxRange) return false
    return true
  })

  if (isCombatDebug()) {
    console.log(
      "  filtered targets:",
      targets.map((t) => t.name),
    )
  }

  return targets
}
