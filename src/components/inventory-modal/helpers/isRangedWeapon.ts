import type { IInventoryItem } from "@/components/shared/types"

export const isRangedWeapon = (item: IInventoryItem): boolean => {
  if (item.kind !== "weapon") return false
  if (!item.properties) return false

  return item.properties.some((prop) => {
    if (typeof prop === "string") return false
    return prop.type === "ranged"
  })
}
