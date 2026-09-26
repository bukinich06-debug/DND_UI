"use client"

import { useState, useCallback } from "react"
import type { IEncounter } from "../types"
import { advanceEncounter } from "../api/advanceEncounter"

interface IUseEndPlayerTurnResult {
  endTurn: () => Promise<IEncounter | null>
  loading: boolean
  error: string | null
}

export const useEndPlayerTurn = (): IUseEndPlayerTurnResult => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const endTurn = useCallback(async (): Promise<IEncounter | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await advanceEncounter()
      return result
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Не удалось завершить ход."
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { endTurn, loading, error }
}
