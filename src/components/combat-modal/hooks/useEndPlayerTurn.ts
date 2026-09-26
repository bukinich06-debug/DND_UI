"use client"

import { useState, useCallback } from "react"
import { endPlayerTurn, type IEndPlayerTurnResult } from "../api/endPlayerTurn"

interface IUseEndPlayerTurnResult {
  endTurn: () => Promise<IEndPlayerTurnResult | null>
  loading: boolean
  error: string | null
}

export const useEndPlayerTurn = (): IUseEndPlayerTurnResult => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const endTurn = useCallback(async (): Promise<IEndPlayerTurnResult | null> => {
    setLoading(true)
    setError(null)

    try {
      const result = await endPlayerTurn()
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
