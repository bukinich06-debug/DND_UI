"use client"

import { useEffect, useState } from "react"
import type { IEncounter } from "../types"
import { getEncounter } from "../api/getEncounter"

const POLL_INTERVAL_MS = 3000

interface IUseEncounterResult {
  encounter: IEncounter | null
  loading: boolean
  error: string | null
  setEncounter: (encounter: IEncounter | null) => void
}

export const useEncounter = (): IUseEncounterResult => {
  const [encounter, setEncounter] = useState<IEncounter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout | null = null

    const poll = async () => {
      try {
        const data = await getEncounter({ signal: controller.signal })
        setEncounter(data)
        setError(null)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось получить данные боя.",
        )
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
          timeoutId = setTimeout(poll, POLL_INTERVAL_MS)
        }
      }
    }

    poll()

    return () => {
      controller.abort()
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return { encounter, loading, error, setEncounter }
}
