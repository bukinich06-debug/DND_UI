import type { ILocation } from "../types"

export interface ITreeNode {
  loc: ILocation
  children: ITreeNode[]
}

const nearestVisibleParent = (
  loc: ILocation,
  visible: Set<string>,
  byId: Map<string, ILocation>,
): string | null => {
  let pid = loc.parentId
  while (pid) {
    if (visible.has(pid)) return pid
    pid = byId.get(pid)?.parentId ?? null
  }
  return null
}

export const buildTree = (locations: ILocation[]): ITreeNode[] => {
  const byId = new Map(locations.map((loc) => [loc.id, loc]))
  const visible = new Set(locations.map((loc) => loc.id))
  const nodes = new Map<string, ITreeNode>()
  for (const loc of locations) nodes.set(loc.id, { loc, children: [] })

  const roots: ITreeNode[] = []
  for (const loc of locations) {
    const node = nodes.get(loc.id)
    if (!node) continue
    const parentId = nearestVisibleParent(loc, visible, byId)
    if (!parentId) {
      roots.push(node)
      continue
    }
    nodes.get(parentId)?.children.push(node)
  }
  return roots
}
