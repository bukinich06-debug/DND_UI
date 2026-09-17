"use client"

import type { ICombatant, IWeaponSlot } from "../types"

interface IUseWeaponTargetsParams {
  weapon: IWeaponSlot
  combatants: ICombatant[]
  playerId: string
}

export const useWeaponTargets = ({
  weapon,
  combatants,
  playerId,
}: IUseWeaponTargetsParams): ICombatant[] => {
  const rangeProperty = weapon.properties.find((p) => p.type === "range")

  const maxRange = rangeProperty?.normal ?? 5

  return combatants.filter((c) => {
    if (c.id === playerId) return false
    if (c.type !== "monster" && c.type !== "npc") return false
    if (c.feetFromPlayer > maxRange) return false
    return true
  })
}
