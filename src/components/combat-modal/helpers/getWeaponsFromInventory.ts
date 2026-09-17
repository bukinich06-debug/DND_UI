import type { IInventoryItem, IItemProperty } from "@/components/shared/types"
import type { IWeaponSlot, IWeaponProperty } from "../types"

const isCombatDebug = () =>
  typeof window !== "undefined" && localStorage.getItem("combatDebug") === "1"

const parseRangeFromString = (
  text: string,
): { normal: number; long?: number } | null => {
  const englishMatch = text.match(/range\s*\(?(\d+)(?:\/(\d+))?\)?/i)
  if (englishMatch) {
    return {
      normal: parseInt(englishMatch[1], 10),
      long: englishMatch[2] ? parseInt(englishMatch[2], 10) : undefined,
    }
  }

  const russianMatch = text.match(/дальность\s*(\d+)(?:\/(\d+))?/i)
  if (russianMatch) {
    return {
      normal: parseInt(russianMatch[1], 10),
      long: russianMatch[2] ? parseInt(russianMatch[2], 10) : undefined,
    }
  }

  const numbersOnlyMatch = text.match(/^(\d+)(?:\/(\d+))?$/)
  if (numbersOnlyMatch) {
    return {
      normal: parseInt(numbersOnlyMatch[1], 10),
      long: numbersOnlyMatch[2] ? parseInt(numbersOnlyMatch[2], 10) : undefined,
    }
  }

  return null
}

const toWeaponProperty = (prop: string | IItemProperty): IWeaponProperty => {
  if (typeof prop === "object" && prop !== null) {
    return {
      type: prop.type,
      text: prop.text,
      normal: prop.normal,
      long: prop.long,
      dice: prop.dice,
      damageType: prop.damageType,
    }
  }

  const propText = String(prop)
  const propLower = propText.toLowerCase()
  const rangeData = parseRangeFromString(propText)
  if (rangeData) {
    return { type: "range", text: propText, ...rangeData }
  }
  if (propLower.includes("two-handed") || propLower.includes("двуруч")) {
    return { type: "twoHanded", text: propText }
  }
  return { type: propText, text: propText }
}

export const getWeaponsFromInventory = (
  items: IInventoryItem[],
): IWeaponSlot[] => {
  return items
    .filter((item) => item.kind === "weapon")
    .map((item) => {
      if (isCombatDebug()) {
        console.log(
          "[getWeaponsFromInventory]",
          item.name,
          "raw properties:",
          item.properties,
        )
      }

      const properties = (item.properties ?? []).map(toWeaponProperty)

      if (isCombatDebug()) {
        console.log("  final properties:", properties)
      }

      return {
        id: item.id,
        name: item.name,
        properties,
      }
    })
}
