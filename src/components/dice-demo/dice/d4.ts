import { TetrahedronGeometry } from "three"
import { buildDie, getPoints } from "../helpers/buildDie"
import { ruby } from "../skins/ruby"

export const d4 = buildDie({
  id: "d4",
  skin: ruby,
  points: getPoints(new TetrahedronGeometry()),
})
