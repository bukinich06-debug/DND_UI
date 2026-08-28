import type {
  ILayoutNode,
  ILocation,
  ILocationLink,
  IPlayerLocation,
  IRoadEdge,
  ITreeEdge,
} from "../types"
import { CARD_H, CARD_W } from "./layoutConst"
import { settlementOf } from "./settlementOf"

const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`)

export const treeEdges = (
  nodes: ILayoutNode[],
  parentOf: Map<string, string | null>,
): ITreeEdge[] => {
  const byId = new Map(nodes.map((n) => [n.loc.id, n]))
  const edges: ITreeEdge[] = []
  for (const node of nodes) {
    const pid = parentOf.get(node.loc.id)
    if (!pid) continue
    const parent = byId.get(pid)
    if (!parent) continue
    const x1 = parent.x + CARD_W / 2
    const y1 = parent.y + CARD_H
    const x2 = node.x + CARD_W / 2
    const y2 = node.y
    const mid = (y1 + y2) / 2
    edges.push({
      fromId: pid,
      toId: node.loc.id,
      d: `M ${x1} ${y1} V ${mid} H ${x2} V ${y2}`,
    })
  }
  return edges
}

export const parentMap = (
  nodes: ILayoutNode[],
  visible: Set<string>,
  allById: Map<string, ILocation>,
) => {
  const map = new Map<string, string | null>()
  for (const node of nodes) {
    let pid = node.loc.parentId
    while (pid && !visible.has(pid)) pid = allById.get(pid)?.parentId ?? null
    map.set(node.loc.id, pid && visible.has(pid) ? pid : null)
  }
  return map
}

export const roadEdges = (
  links: ILocationLink[],
  nodes: ILayoutNode[],
  allById: Map<string, ILocation>,
  player: IPlayerLocation | null,
): IRoadEdge[] => {
  const byPos = new Map(nodes.map((n) => [n.loc.id, n]))
  const routePairs = new Set<string>()
  let currentPair: string | null = null

  if (player?.travel && player.location) {
    const start = settlementOf(player.location.id, allById)
    const path = start
      ? [start.id, ...player.travel.route]
      : [...player.travel.route]
    for (let i = 0; i < path.length - 1; i++) {
      const key = pairKey(path[i], path[i + 1])
      routePairs.add(key)
      if (i === player.travel.legIndex) currentPair = key
    }
  }

  const seen = new Set<string>()
  const edges: IRoadEdge[] = []

  for (const link of links) {
    const fromLoc = allById.get(link.fromId)
    const toLoc = allById.get(link.toId)
    if (!fromLoc || !toLoc) continue
    if (fromLoc.kind !== "settlement" || toLoc.kind !== "settlement") continue
    const from = byPos.get(link.fromId)
    const to = byPos.get(link.toId)
    if (!from || !to) continue
    const key = pairKey(link.fromId, link.toId)
    if (seen.has(key)) continue
    seen.add(key)

    const x1 = from.x + CARD_W / 2
    const y1 = from.y + CARD_H / 2
    const x2 = to.x + CARD_W / 2
    const y2 = to.y + CARD_H / 2
    const mx = (x1 + x2) / 2
    const my = Math.min(y1, y2) - 36
    const onRoute = routePairs.has(key)

    edges.push({
      id: link.id,
      fromId: link.fromId,
      toId: link.toId,
      d: `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`,
      labelX: mx,
      labelY: my,
      days: link.days,
      label: link.label,
      onRoute,
      currentLeg: currentPair === key,
    })
  }

  return edges
}
