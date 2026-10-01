import type { ISkin } from "../types"
import { drawVeins, fillGlow } from "./paint"

export const bone: ISkin = {
  id: "bone",
  paint: (ctx, size) => {
    fillGlow(ctx, size, "#f4ead2", "#c9b68a")
    drawVeins(ctx, size, "#8a7550", 4)
  },
  ink: "#2a1a10",
  font: "bold 96px Georgia, serif",
  material: {
    roughness: 0.6,
    clearcoat: 0.3,
    bumpScale: 4,
  },
}
