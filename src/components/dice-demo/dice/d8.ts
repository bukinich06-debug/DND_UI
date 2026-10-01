import { OctahedronGeometry } from "three"
import { buildDie, getPoints } from "../helpers/buildDie"
import { jade } from "../skins/jade"

export const d8 = buildDie({
  id: "d8",
  skin: jade,
  points: getPoints(new OctahedronGeometry()),
})
