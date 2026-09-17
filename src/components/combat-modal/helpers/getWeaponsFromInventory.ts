import type { IInventoryItem } from "@/components/shared/types"
import type { IWeaponSlot, IWeaponProperty } from "../types"

export const getWeaponsFromInventory = (
  items: IInventoryItem[],
): IWeaponSlot[] => {
  return items
    .filter((item) => item.kind === "weapon")
    .map((item) => {
      const properties: IWeaponProperty[] = (item.properties ?? []).map(
        (prop) => {
          if (typeof prop === "object") {
            if (prop.type === "range" && prop.normal !== undefined) {
              return {
                type: "range",
                normal: prop.normal,
                long: prop.long,
                text: prop.text,
              }
            }
            
            if (prop.type === "twoHanded" || prop.type === "two-handed") {
              return {
                type: "twoHanded",
                text: prop.text,
              }
            }

            return {
              type: prop.type,
              text: prop.text,
            }
          }

          const rangeMatch = prop.match(/range\s*\((\d+)(?:\/(\d+))?\)/i)
          if (rangeMatch) {
            return {
              type: "range",
              normal: parseInt(rangeMatch[1], 10),
              long: rangeMatch[2] ? parseInt(rangeMatch[2], 10) : undefined,
              text: prop,
            }
          }

          if (prop.toLowerCase().includes("two-handed")) {
            return {
              type: "twoHanded",
              text: prop,
            }
          }

          return {
            type: prop,
            text: prop,
          }
        },
      )

      return {
        id: item.id,
        name: item.name,
        properties,
      }
    })
}
