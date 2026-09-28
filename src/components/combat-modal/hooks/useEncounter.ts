"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import type { IEncounter } from "../types"
import { getEncounter } from "../api/getEncounter"

const POLL_INTERVAL_MS = 3000

interface IUseEncounterResult {
  encounter: IEncounter | null
  loading: boolean
  error: string | null
  networkError: boolean
  setEncounter: (encounter: IEncounter | null) => void
  bumpVersion: () => void
}

export const useEncounter = (): IUseEncounterResult => {
  const [encounter, setEncounterState] = useState<IEncounter | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [networkError, setNetworkError] = useState(false)
  const versionRef = useRef(0)

  const bumpVersion = useCallback(() => {
    versionRef.current++
  }, [])

  const setEncounter = useCallback((encounter: IEncounter | null) => {
    versionRef.current++
    setEncounterState(encounter)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let timeoutId: NodeJS.Timeout | null = null

    const poll = async () => {
      const currentVersion = ++versionRef.current

      try {
        const data = await getEncounter({ signal: controller.signal })
        
        if (currentVersion !== versionRef.current) return
        
        setEncounterState(data)
        setError(null)
        setNetworkError(false)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return
        
        if (currentVersion !== versionRef.current) return
        
        setNetworkError(true)
        setError(
          err instanceof Error
            ? err.message
            : "Не удалось получить данные боя.",
        )
      } finally {
        if (!controller.signal.aborted) {
          if (currentVersion === versionRef.current) {
            setLoading(false)
          }
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

  return { encounter, loading, error, networkError, setEncounter, bumpVersion }
}
