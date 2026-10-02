import { Vector3 } from "three"
import { buildDie } from "../helpers/buildDie"
import { gold } from "../skins/gold"

// Pentagonal trapezohedron: two tips and two zig-zag rings of 5 corners.
// Ring height (1 - cos 36°) / (1 + cos 36°) keeps every kite face flat.
const TIP = 1.2
const RING = (TIP * (1 - Math.cos(Math.PI / 5))) / (1 + Math.cos(Math.PI / 5))

const ring = (offset: number, y: number) =>
  Array.from({ length: 5 }, (_, k) => {
    const angle = offset + (k * 2 * Math.PI) / 5
    return new Vector3(Math.cos(angle), y, Math.sin(angle))
  })

export const d10 = buildDie({
  id: "d10",
  skin: gold,
  points: [
    new Vector3(0, TIP, 0),
    new Vector3(0, -TIP, 0),
    ...ring(0, RING),
    ...ring(Math.PI / 5, -RING),
  ],
})
