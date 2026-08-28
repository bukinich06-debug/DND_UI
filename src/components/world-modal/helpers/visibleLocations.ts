import type { ILocation, IPlayerLocation } from "../types"

const ancestorsOf = (id: string, byId: Map<string, ILocation>): string[] => {
  const ids: string[] = []
  let cur = byId.get(id)
  while (cur) {
    ids.push(cur.id)
    cur = cur.parentId ? byId.get(cur.parentId) : undefined
  }
  return ids
}

export const visibleLocations = (
  locations: ILocation[],
  player: IPlayerLocation | null,
): ILocation[] => {
  const byId = new Map(locations.map((loc) => [loc.id, loc]))
  const known = new Set<string>()
  if (player?.location) known.add(player.location.id)
  if (player?.travel) {
    known.add(player.travel.destinationId)
    for (const id of player.travel.route) known.add(id)
  }

  const mustShow = new Set<string>()
  for (const id of known) {
    for (const aid of ancestorsOf(id, byId)) mustShow.add(aid)
  }

  return locations.filter((loc) => !loc.isSecret || mustShow.has(loc.id))
}
