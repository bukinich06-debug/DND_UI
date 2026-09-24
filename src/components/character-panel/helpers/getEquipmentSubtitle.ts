import type { IInventoryItem, IItemProperty } from "@/components/shared/types"

const getDamageString = (properties: Array<string | IItemProperty> | undefined): string | null => {
  if (!properties) return null

  for (const prop of properties) {
    if (typeof prop === "string") continue
    if (prop.type === "damage" && prop.dice && prop.damageType) {
      return `${prop.dice} ${prop.damageType}`
    }
  }

  return null
}

const getAcString = (properties: Array<string | IItemProperty> | undefined): string | null => {
  if (!properties) return null

  for (const prop of properties) {
    const text = typeof prop === "string" ? prop : prop.text
    const acMatch = text.match(/AC\s*(\d+)/i) || text.match(/КД\s*(\d+)/i)
    if (acMatch) return `КД ${acMatch[1]}`
  }

  return null
}

export const getEquipmentSubtitle = (item: IInventoryItem): string | null => {
  if (item.kind === "armor") return getAcString(item.properties)
  if (item.kind === "weapon") return getDamageString(item.properties)
  return null
}
