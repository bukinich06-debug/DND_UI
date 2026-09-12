"use client"

import { useEffect, useState } from "react"
import { getNpcs } from "../api/getNpcs"
import type { INpcAtLocation } from "../types"

interface IUseNearbyResult {
  npcs: INpcAtLocation[]
  loading: boolean
  error: string | null
}

export const useNearby = (locationEpoch: number): IUseNearbyResult => {
  const [npcs, setNpcs] = useState<INpcAtLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    getNpcs({ signal: controller.signal })
      .then(setNpcs)
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return
        setNpcs([])
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось получить NPC рядом с игроком.",
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [locationEpoch])

  return { npcs, loading, error }
}
