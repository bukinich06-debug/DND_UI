import type { ILocation } from "../types"

export const settlementOf = (
  startId: string,
  byId: Map<string, ILocation>,
): ILocation | null => {
  let cur = byId.get(startId)
  while (cur) {
    if (cur.kind === "settlement") return cur
    cur = cur.parentId ? byId.get(cur.parentId) : undefined
  }
  return null
}
