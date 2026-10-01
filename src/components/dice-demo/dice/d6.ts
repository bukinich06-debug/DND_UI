import { BoxGeometry } from "three"
import { buildDie, getPoints } from "../helpers/buildDie"
import { bone } from "../skins/bone"

export const d6 = buildDie({
  id: "d6",
  skin: bone,
  points: getPoints(new BoxGeometry()),
  edgeUp: true,
})
