import type { EquipSlot } from "@/components/shared/types"
import type { ReactNode } from "react"
import {
  IconShield,
  IconSword,
} from "@/components/shared/icon"

export const getSlotIcon = (slot: EquipSlot): ReactNode => {
  if (slot === "armor") return <IconShield />
  return <IconSword />
}
