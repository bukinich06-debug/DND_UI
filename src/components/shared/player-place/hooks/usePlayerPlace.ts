"use client"

import { useEffect, useState } from "react"
import { getPlayerPlace } from "../api/getPlayerPlace"

interface IUsePlayerPlaceResult {
  name: string | null
  summary: string | null
  loading: boolean
  error: string | null
}

export const usePlayerPlace = (
  locationEpoch: number,
): IUsePlayerPlaceResult => {
  const [name, setName] = useState<string | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    getPlayerPlace({ signal: controller.signal })
      .then((data) => {
        setName(data.location?.name ?? null)
        setSummary(data.location?.summary ?? null)
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return
        setName(null)
        setSummary(null)
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось получить текущую локацию игрока.",
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [locationEpoch])

  return { name, summary, loading, error }
}
