"use client"

import type { PurseUnit } from "../helpers/diffUnits"
import { usePurseContext } from "./usePurseState"

interface IPurseFlash {
  deltaCp: number
  changedUnits: PurseUnit[]
}

export const usePurseFlash = (): IPurseFlash => {
  const { deltaCp, changedUnits } = usePurseContext()
  return { deltaCp, changedUnits }
}
