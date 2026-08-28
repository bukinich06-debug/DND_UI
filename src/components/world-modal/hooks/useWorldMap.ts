import { useCallback, useEffect, useMemo, useState } from "react"
import { getLocationLinks } from "../api/getLocationLinks"
import { getLocations } from "../api/getLocations"
import { getPlayerLocation } from "../api/getPlayerLocation"
import { goToLocation } from "../api/goToLocation"
import { buildTree } from "../helpers/buildTree"
import { parentMap, roadEdges, treeEdges } from "../helpers/edgePaths"
import { byIdMap, layoutTree } from "../helpers/layoutTree"
import { visibleLocations } from "../helpers/visibleLocations"
import type { ILocation, ILocationLink, IPlayerLocation } from "../types"

export const useWorldMap = (onMoved: () => void) => {
  const [locations, setLocations] = useState<ILocation[]>([])
  const [links, setLinks] = useState<ILocationLink[]>([])
  const [player, setPlayer] = useState<IPlayerLocation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [moving, setMoving] = useState(false)

  useEffect(() => {
    const ac = new AbortController()
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [locs, roads, pos] = await Promise.all([
          getLocations({ signal: ac.signal }),
          getLocationLinks({ signal: ac.signal }),
          getPlayerLocation({ signal: ac.signal }),
        ])
        setLocations(locs)
        setLinks(roads)
        setPlayer(pos)
      } catch (e) {
        if (ac.signal.aborted) return
        setError(
          e instanceof Error ? e.message : "Не удалось загрузить карту мира.",
        )
      } finally {
        if (!ac.signal.aborted) setLoading(false)
      }
    }
    void load()
    return () => ac.abort()
  }, [])

  const visible = useMemo(
    () => visibleLocations(locations, player),
    [locations, player],
  )
  const allById = useMemo(() => byIdMap(locations), [locations])
  const layout = useMemo(() => layoutTree(buildTree(visible)), [visible])
  const visibleIds = useMemo(
    () => new Set(visible.map((loc) => loc.id)),
    [visible],
  )
  const parents = useMemo(
    () => parentMap(layout.nodes, visibleIds, allById),
    [layout.nodes, visibleIds, allById],
  )
  const tree = useMemo(
    () => treeEdges(layout.nodes, parents),
    [layout.nodes, parents],
  )
  const roads = useMemo(
    () => roadEdges(links, layout.nodes, allById, player),
    [links, layout.nodes, allById, player],
  )

  const currentId = player?.location?.id ?? null

  const moveTo = useCallback(
    async (locationId: string) => {
      if (locationId === currentId || moving) return
      setMoving(true)
      setError(null)
      try {
        setPlayer(await goToLocation(locationId))
        onMoved()
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Не удалось перейти в локацию.",
        )
      } finally {
        setMoving(false)
      }
    },
    [currentId, moving, onMoved],
  )

  return {
    loading,
    error,
    moving,
    layout,
    tree,
    roads,
    currentId,
    travel: player?.travel ?? null,
    moveTo,
  }
}
