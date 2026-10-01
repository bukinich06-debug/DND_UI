import { useState } from "react"
import { planRoll } from "../helpers/planRoll"
import type { IDie, IRoll } from "../types"

const rollDie = (sides: number) => Math.ceil(Math.random() * sides)

export const useRoll = () => {
  const [roll, setRoll] = useState<IRoll | null>(null)
  const [done, setDone] = useState(false)

  // In the real game `value` comes from the server (postDiceRoll).
  const throwDie = (die: IDie, target: number | null) => {
    const value = target && target <= die.sides ? target : rollDie(die.sides)
    setDone(false)
    setRoll(planRoll(die, value))
  }

  const finish = () => setDone(true)
  const status = roll && !done ? "rolling" : "throw"

  return { roll, done, status, throwDie, finish }
}
