import type { ISkin } from "../types"
import { drawVeins, fillGlow } from "./paint"

export const jade: ISkin = {
  id: "jade",
  paint: (ctx, size) => {
    fillGlow(ctx, size, "#3fae7a", "#0d4a30")
    drawVeins(ctx, size, "#bff5d8", 8)
    drawVeins(ctx, size, "#062818", 3)
  },
  ink: "#f4ead2",
  font: "bold 96px Georgia, serif",
  material: {
    roughness: 0.25,
    clearcoat: 1,
    clearcoatRoughness: 0.3,
    bumpScale: 4,
  },
}
