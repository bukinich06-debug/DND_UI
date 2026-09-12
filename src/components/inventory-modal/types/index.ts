import type { ItemKind, ItemRarity } from "@/components/shared/types"

export type EquipSlot = "armor" | "mainHand" | "offHand"

interface IItemProp {
  type: "twoHanded" | string
  text: string
}

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
