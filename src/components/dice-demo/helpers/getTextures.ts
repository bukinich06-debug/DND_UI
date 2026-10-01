import { CanvasTexture, SRGBColorSpace } from "three"
import type { IDie, ISkin, ITextures } from "../types"
import { CELL, getCell } from "./atlas"

const cache = new Map<string, ITextures>()

const createCanvas = (die: IDie, background: string, font: string) => {
  const canvas = document.createElement("canvas")
  canvas.width = die.cols * CELL
  canvas.height = die.rows * CELL

  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = background
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = font

  return { canvas, ctx }
}

const drawNumber = (
  ctx: CanvasRenderingContext2D,
  number: number,
  [x, y]: [number, number],
) => {
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(String(number), x, y + 4)

  if (number === 6 || number === 9) ctx.fillRect(x - 18, y + 44, 36, 7)
}

const toTexture = (canvas: HTMLCanvasElement, isColor: boolean) => {
  const texture = new CanvasTexture(canvas)
  if (isColor) texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

// map  — surface pattern + numbers in ink color
// bump — white surface, dark blurred numbers: dark means deeper, so numbers look carved
// glow — black surface, white numbers: lights up only the numbers on crit
const draw = (die: IDie, skin: ISkin): ITextures => {
  const color = createCanvas(die, "#000", skin.font)
  const depth = createCanvas(die, "#fff", skin.font)
  const glow = createCanvas(die, "#000", skin.font)

  depth.ctx.shadowColor = "#000"
  depth.ctx.shadowBlur = 6

  die.faces.forEach((face, i) => {
    const cell = getCell(i, die.cols)

    color.ctx.save()
    color.ctx.beginPath()
    color.ctx.rect(cell.x, cell.y, CELL, CELL)
    color.ctx.clip()
    color.ctx.translate(cell.x, cell.y)
    skin.paint(color.ctx, CELL)
    color.ctx.restore()

    color.ctx.fillStyle = skin.ink
    depth.ctx.fillStyle = "#000"
    glow.ctx.fillStyle = "#fff"
    drawNumber(color.ctx, face.number, cell.center)
    drawNumber(depth.ctx, face.number, cell.center)
    drawNumber(glow.ctx, face.number, cell.center)
  })

  return {
    map: toTexture(color.canvas, true),
    bump: toTexture(depth.canvas, false),
    glow: toTexture(glow.canvas, true),
  }
}

export const getTextures = (die: IDie, skin: ISkin) => {
  const key = `${die.id}/${skin.id}`
  if (!cache.has(key)) cache.set(key, draw(die, skin))
  return cache.get(key)!
}
