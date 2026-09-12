import type { IPurse } from "@/components/shared/types"

const UNITS = ["pp", "gp", "ep", "sp", "cp"] as const

interface IPursePart {
  unit: typeof UNITS[number]
  amount: number
}

export const formatPurse = (purse: IPurse): IPursePart[] =>
  UNITS.filter((unit) => purse[unit] > 0).map((unit) => ({
    unit,
    amount: purse[unit],
  }))
