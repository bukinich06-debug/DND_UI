"use client"

import { useState, useCallback } from "react"
import type { IEncounter } from "../types"
import { advanceEncounter } from "../api/advanceEncounter"

interface IUseAdvanceEncounterResult {
  advance: () => Promise<IEncounter | null>
  loading: boolean
  error: string | null
}

export const useAdvanceEncounter = (): IUseAdvanceEncounterResult => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const advance = useCallback(async (): Promise<IEncounter | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await advanceEncounter()
      return result
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Не удалось продвинуть ход."
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { advance, loading, error }
}
