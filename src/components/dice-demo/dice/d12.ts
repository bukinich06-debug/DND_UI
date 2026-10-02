import { DodecahedronGeometry } from "three"
import { buildDie, getPoints } from "../helpers/buildDie"
import { obsidian } from "../skins/obsidian"

export const d12 = buildDie({
  id: "d12",
  skin: obsidian,
  points: getPoints(new DodecahedronGeometry()),
})
