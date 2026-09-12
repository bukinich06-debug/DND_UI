/** PHB 5e: cumulative XP required to reach each level (index = level). */
const XP_FOR_LEVEL = [
  0, 0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
] as const

export const xpToNext = (level: number): number => {
  if (level >= 20) return XP_FOR_LEVEL[20]
  if (level < 1) return XP_FOR_LEVEL[2]
  return XP_FOR_LEVEL[level + 1]
}
