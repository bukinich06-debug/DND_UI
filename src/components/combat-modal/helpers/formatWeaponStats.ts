import type { IWeaponProperty } from "../types"

export const formatBonus = (bonus: number | null): string => {
  if (bonus === null) return "—"
  return bonus >= 0 ? `+${bonus}` : `${bonus}`
}

export const getDamageInfo = (
  properties: IWeaponProperty[],
): { dice: string; damageType: string } | null => {
  const damageProp = properties.find((p) => p.type === "damage")
  if (!damageProp || !damageProp.dice || !damageProp.damageType) return null

  return {
    dice: damageProp.dice,
    damageType: damageProp.damageType,
  }
}
