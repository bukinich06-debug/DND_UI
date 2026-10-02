import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Quaternion, type Group } from "three"
import { RISE_TIME, ROLL_TIME, START_SCALE, START_Y } from "../constants"
import type { IRoll } from "../types"

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
const easeOutQuart = (t: number) => 1 - (1 - t) ** 4
const easeOutBack = (t: number) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2

const turn = new Quaternion()

// Rises out of the button and grows to full size.
const rise = (die: Group, time: number) => {
  const t = Math.min(time / RISE_TIME, 1)

  die.position.y = START_Y * (1 - easeOutCubic(t))
  die.scale.setScalar(START_SCALE + (1 - START_SCALE) * easeOutBack(t))
}

// Spins around random axes; every spin fades to zero, so the die stops exactly on `target`.
const spin = (die: Group, roll: IRoll, time: number) => {
  const left = 1 - easeOutQuart(Math.min(time / ROLL_TIME, 1))

  die.quaternion.copy(roll.target)
  for (const { axis, angle } of roll.spins)
    die.quaternion.multiply(turn.setFromAxisAngle(axis, angle * left))
}

// After the roll the die keeps gently hovering.
const hover = (die: Group, time: number) => {
  die.position.y = Math.sin((time - ROLL_TIME) * 2) * 0.06
}

export const usePlayback = (roll: IRoll, onDone: () => void) => {
  const body = useRef<Group>(null)
  const run = useRef({ roll, startedAt: performance.now(), finished: false })

  useFrame(() => {
    const die = body.current
    if (!die) return
    if (run.current.roll !== roll)
      run.current = { roll, startedAt: performance.now(), finished: false }

    const time = (performance.now() - run.current.startedAt) / 1000
    spin(die, roll, time)

    if (time < ROLL_TIME) return rise(die, time)

    hover(die, time)

    if (!run.current.finished) {
      run.current.finished = true
      onDone()
    }
  })

  return body
}
