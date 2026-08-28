import type { ILayoutNode, ILocation } from "../types"
import type { ITreeNode } from "./buildTree"
import { CARD_H, CARD_W, GAP_X, GAP_Y, PAD } from "./layoutConst"

const subtreeWidth = (node: ITreeNode): number => {
  if (!node.children.length) return CARD_W
  return (
    node.children.reduce((sum, child) => sum + subtreeWidth(child), 0) +
    GAP_X * (node.children.length - 1)
  )
}

interface ITreeLayout {
  nodes: ILayoutNode[]
  width: number
  height: number
}

export const layoutTree = (roots: ITreeNode[]): ITreeLayout => {
  const placed: ILayoutNode[] = []
  let maxX = 0
  let maxY = 0

  const place = (node: ITreeNode, left: number, y: number) => {
    const w = subtreeWidth(node)
    const x = left + w / 2 - CARD_W / 2
    placed.push({ loc: node.loc, x: PAD + x, y: PAD + y })
    maxX = Math.max(maxX, PAD + x + CARD_W)
    maxY = Math.max(maxY, PAD + y + CARD_H)
    let cx = left
    for (const child of node.children) {
      const cw = subtreeWidth(child)
      place(child, cx, y + CARD_H + GAP_Y)
      cx += cw + GAP_X
    }
  }

  let left = 0
  for (const root of roots) {
    const w = subtreeWidth(root)
    place(root, left, 0)
    left += w + GAP_X * 2
  }

  return { nodes: placed, width: maxX + PAD, height: maxY + PAD }
}

export const byIdMap = (locations: ILocation[]): Map<string, ILocation> =>
  new Map(locations.map((loc) => [loc.id, loc]))
