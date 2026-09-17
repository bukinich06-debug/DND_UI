import type { IPlayer } from "@/components/character-panel/types"
import type { IWeaponProperty } from "../types"

const abilityMod = (score: number): number => Math.floor((score - 10) / 2)

const isFinesse = (properties: IWeaponProperty[]): boolean => {
  return properties.some(
    (p) =>
      (p.text ?? "").toLowerCase().includes("finesse") ||
      (p.text ?? "").toLowerCase().includes("фехтовальн"),
  )
}

const isRanged = (properties: IWeaponProperty[]): boolean => {
  return properties.some((p) => p.type === "range")
}

export const getAttackBonus = (
  weapon: { properties: IWeaponProperty[] },
  player: IPlayer | null,
): number | null => {
  if (!player) return null

  const useDex = isRanged(weapon.properties) || isFinesse(weapon.properties)
  const abilityBonus = useDex ? abilityMod(player.dex) : abilityMod(player.str)

  return player.proficiencyBonus + abilityBonus
}
