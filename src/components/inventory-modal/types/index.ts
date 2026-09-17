import type { ItemKind, ItemRarity, IItemProp } from "@/components/shared/types"

export type EquipSlot = "armor" | "mainHand" | "offHand"

export interface IApiItem {
  id: string
  name: string
  kind: ItemKind
  rarity: ItemRarity | null
  description: string
  weight: number | null
  valueCp: number | null
  quantity: number
  properties: IItemProp[] | null
  equipSlot: EquipSlot | null
}
