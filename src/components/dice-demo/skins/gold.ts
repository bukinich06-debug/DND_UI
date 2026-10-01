import type { ISkin } from "../types"
import { drawBrush, fillGlow } from "./paint"

export const gold: ISkin = {
  id: "gold",
  paint: (ctx, size) => {
    fillGlow(ctx, size, "#f6d98a", "#a8741f")
    drawBrush(ctx, size, "#fff6d0", 60)
  },
  ink: "#5a0e14",
  font: "bold 96px Georgia, serif",
  material: {
    roughness: 0.35,
    metalness: 1,
    bumpScale: 6,
  },
}
