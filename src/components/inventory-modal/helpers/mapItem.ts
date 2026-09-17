import type { IInventoryItem, ItemCategory } from "@/components/shared/types"
import type { IApiItem } from "../types"

const kindToCategory = (kind: IApiItem["kind"]): ItemCategory => {
  if (kind === "weapon") return "weapons"
  if (kind === "armor" || kind === "shield") return "armor"
  if (kind === "consumable") return "consumables"
  if (kind === "key") return "quest"
  return "other"
}

const formatValueCp = (valueCp: number | null): string | undefined => {
  if (valueCp == null || valueCp <= 0) return undefined

  const gp = Math.floor(valueCp / 100)
  const rem = valueCp % 100
  const sp = Math.floor(rem / 10)
  const cp = rem % 10
  const parts: string[] = []
  if (gp) parts.push(`${gp} gp`)
  if (sp) parts.push(`${sp} sp`)
  if (cp) parts.push(`${cp} cp`)
  return parts.join(" ")
}

export const mapItem = (item: IApiItem): IInventoryItem => {
  return {
    id: item.id,
    name: item.name,
    kind: item.kind,
    category: kindToCategory(item.kind),
    qty: item.quantity,
    description: item.description,
    weight: item.weight ?? 0,
    rarity: item.rarity ?? undefined,
    equipped: item.equipSlot != null,
    isTwoHanded: item.properties?.some((p) => p.type === "twoHanded") ?? false,
    value: formatValueCp(item.valueCp),
    // Keep full structured props (type/normal/long/dice/damageType). Never strip to text-only.
    properties: item.properties?.length ? item.properties : undefined,
  }
}
