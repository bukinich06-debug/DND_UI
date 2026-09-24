import type { IInventoryItem, EquipSlot } from "@/components/shared/types"
import { isRangedWeapon } from "./isRangedWeapon"

export const resolveEquipSlot = (item: IInventoryItem): EquipSlot => {
  if (item.kind === "armor") return "armor"
  if (isRangedWeapon(item)) return "ranged"
  return "mainHand"
}

export const canEquip = (item: IInventoryItem) =>
  !item.equipped &&
  item.qty === 1 &&
  (item.kind === "armor" || item.kind === "weapon" || item.kind === "shield")
