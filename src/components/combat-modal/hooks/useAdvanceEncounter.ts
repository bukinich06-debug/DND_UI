"use client"

import { useState, useCallback } from "react"
import type { IEncounter, ICombatOutcome } from "../types"
import { advanceEncounter } from "../api/advanceEncounter"

interface IAdvanceResult {
  encounter: IEncounter | null
  encounterEnded: boolean
  encounterResult: ICombatOutcome | null
}

interface IUseAdvanceEncounterResult {
  advance: () => Promise<IAdvanceResult | null>
  loading: boolean
  error: string | null
}

export const useAdvanceEncounter = (): IUseAdvanceEncounterResult => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const advance = useCallback(async (): Promise<IAdvanceResult | null> => {
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
