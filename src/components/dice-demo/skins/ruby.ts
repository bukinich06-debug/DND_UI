import type { ISkin } from "../types"
import { drawSparks, drawVeins, fillGlow } from "./paint"

export const ruby: ISkin = {
  id: "ruby",
  paint: (ctx, size) => {
    fillGlow(ctx, size, "#d0243c", "#4a0610")
    drawVeins(ctx, size, "#ff9aa8", 6)
    drawSparks(ctx, size, "#ffd0d8", 20)
  },
  ink: "#f2c46d",
  font: "bold 96px Georgia, serif",
  material: {
    roughness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0.3,
    bumpScale: 4,
  },
}
