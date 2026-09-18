"use client"

import { useState, useCallback } from "react"
import type { IEncounter } from "../types"
import { playerCombatTurn } from "../api/playerCombatTurn"

interface IUsePlayerCombatTurnParams {
  encounterId: string
}

interface IUsePlayerCombatTurnResult {
  executeTurn: (playerAction: string) => Promise<IEncounter | null>
  loading: boolean
  error: string | null
}

export const usePlayerCombatTurn = ({
  encounterId,
}: IUsePlayerCombatTurnParams): IUsePlayerCombatTurnResult => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const executeTurn = useCallback(
    async (playerAction: string): Promise<IEncounter | null> => {
      setLoading(true)
      setError(null)

      try {
        const result = await playerCombatTurn({
          encounterId,
          playerAction,
        })
        return result
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Не удалось выполнить ход игрока."
        setError(errorMessage)
        return null
      } finally {
        setLoading(false)
      }
    },
    [encounterId],
  )

  return { executeTurn, loading, error }
}
