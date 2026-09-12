import { useEffect, useState } from "react"
import { getItems } from "../api/getItems"
import { getNpcs } from "../api/getNpcs"
import type { IComposerItem, IComposerNpc } from "../types"

interface IParams {
  locationEpoch: number
}

export const useComposerLists = ({ locationEpoch }: IParams) => {
  const [npcs, setNpcs] = useState<IComposerNpc[]>([])
  const [items, setItems] = useState<IComposerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    Promise.all([
      getNpcs({ signal: controller.signal }),
      getItems({ signal: controller.signal }),
    ])
      .then(([nextNpcs, nextItems]) => {
        setNpcs(nextNpcs)
        setItems(nextItems)
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось загрузить списки для действий.",
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [locationEpoch])

  return { npcs, items, loading, error }
}
