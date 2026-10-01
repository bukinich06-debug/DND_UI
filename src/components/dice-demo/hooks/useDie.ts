import { useState } from "react"
import { dice } from "../dice"
import { skins } from "../skins"

// Picking a die also switches to its default skin; the skin can still be changed by hand.
export const useDie = () => {
  const [die, setDie] = useState(dice[dice.length - 1])
  const [skin, setSkin] = useState(die.skin)

  const pickDie = (id: string) => {
    const next = dice.find((item) => item.id === id)!
    setDie(next)
    setSkin(next.skin)
  }

  const pickSkin = (id: string) =>
    setSkin(skins.find((item) => item.id === id)!)

  return { die, dice, skin, skins, pickDie, pickSkin }
}
