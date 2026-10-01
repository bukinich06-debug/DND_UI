import { IcosahedronGeometry } from "three"
import { buildDie, getPoints } from "../helpers/buildDie"
import { amethyst } from "../skins/amethyst"

export const d20 = buildDie({
  id: "d20",
  skin: amethyst,
  points: getPoints(new IcosahedronGeometry()),
})
