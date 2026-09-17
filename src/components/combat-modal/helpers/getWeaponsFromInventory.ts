import type { IInventoryItem } from "@/components/shared/types"
import type { IWeaponSlot } from "../types"

export const getWeaponsFromInventory = (
  items: IInventoryItem[],
): IWeaponSlot[] => {
  return items
    .filter((item) => item.kind === "weapon")
    .map((item) => ({
      id: item.id,
      name: item.name,
      properties: item.properties ?? [],
    }))
}
