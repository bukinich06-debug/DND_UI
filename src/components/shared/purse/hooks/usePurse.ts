"use client"

import type { IPurse } from "@/components/shared/types"
import { usePurseContext } from "./usePurseState"

export const usePurse = (): IPurse | null => {
  const { purse } = usePurseContext()
  return purse
}
