import { MAX_GLOW, MIN_GLOW } from "../constants"
import type { IRoll } from "../types"

// Highest face glows gold, a natural 1 glows red — on any die.
export const getGlow = ({ die, value }: IRoll) => {
  if (value === die.sides) return MAX_GLOW
  if (value === 1) return MIN_GLOW
}
