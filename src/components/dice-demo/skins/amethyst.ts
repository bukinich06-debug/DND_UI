import type { ISkin } from "../types"
import { drawVeins, fillGlow } from "./paint"

export const amethyst: ISkin = {
  id: "amethyst",
  paint: (ctx, size) => {
    fillGlow(ctx, size, "#8a4ad6", "#2a0f52")
    drawVeins(ctx, size, "#e3c8ff", 10)
    drawVeins(ctx, size, "#140628", 4)
  },
  ink: "#f2c46d",
  font: "bold 96px Georgia, serif",
  material: {
    roughness: 0.3,
    clearcoat: 0.8,
    clearcoatRoughness: 0.3,
    bumpScale: 4,
  },
}
