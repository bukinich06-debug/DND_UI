import type { IInventoryItem } from "@/components/shared/types";
import type { EquipSlot } from "../types";

export const resolveEquipSlot = (item: IInventoryItem): EquipSlot => {
  if (item.kind === "armor") return "armor";
  return "mainHand";
};

export const canEquip = (item: IInventoryItem) =>
  !item.equipped && item.qty === 1 && (item.kind === "armor" || item.kind === "weapon" || item.kind === "shield");
