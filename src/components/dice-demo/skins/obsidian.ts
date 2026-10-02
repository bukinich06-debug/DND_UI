import type { ISkin } from "../types"
import { drawSparks, drawVeins, fillGlow } from "./paint"

export const obsidian: ISkin = {
  id: "obsidian",
  paint: (ctx, size) => {
    fillGlow(ctx, size, "#221d2e", "#08070c")
    drawVeins(ctx, size, "#7a68a8", 6)
    drawSparks(ctx, size, "#ffffff", 30)
  },
  ink: "#ece6fa",
  font: "bold 96px Georgia, serif",
  material: {
    roughness: 0.25,
    metalness: 0.1,
    clearcoat: 0.8,
    clearcoatRoughness: 0.3,
    bumpScale: 4,
  },
}
