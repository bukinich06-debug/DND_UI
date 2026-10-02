import { Vector3 } from "three"
import type { IDie, IRoll } from "../types"

const random = (min: number, max: number) => min + Math.random() * (max - min)

// The camera looks along -z with y up, so the target is the rotation that turns
// the result face's frame into the identity: normal to the camera, number upright.
export const planRoll = (die: IDie, value: number): IRoll => ({
  die,
  value,
  target: die.faces
    .find((face) => face.number === value)!
    .frame.clone()
    .invert(),
  spins: [
    { axis: new Vector3().randomDirection(), angle: random(4, 7) * Math.PI },
    { axis: new Vector3().randomDirection(), angle: random(1, 3) * Math.PI },
  ],
})
