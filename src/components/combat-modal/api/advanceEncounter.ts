import type {
  IEncounter,
  IApiEncounterResponse,
  IApiParticipant,
  ICombatant,
  ICombatLogEntry,
} from "../types"
import { getCombatApiEnv } from "./env"

interface IAdvanceEncounterParams {
  signal?: AbortSignal
}

interface IApiAdvanceResponse {
  success: boolean
  errorCode?: string
  encounter?: {
    encounterId: string
    round: number
    currentTurnIndex: number
    status: string
    currentParticipantId: string
    isPlayerTurn: boolean
    participants: IApiParticipant[]
    log?: ICombatLogEntry[]
  }
  newLogEntries?: ICombatLogEntry[]
}

const mapParticipantToCombatant = (
  participant: IApiParticipant,
  currentParticipantId: string,
): ICombatant => ({
  id: participant.id,
  name: participant.displayName,
  type: participant.kind,
  hp: participant.hpCurrent,
  maxHp: participant.hpMax,
  feetFromPlayer: participant.feetFromPlayer,
  initiative: participant.initiative,
  isOut: participant.isOut,
  isPlayerTurn: participant.id === currentParticipantId,
})

export const advanceEncounter = async ({
  signal,
}: IAdvanceEncounterParams = {}): Promise<IEncounter> => {
  const { baseUrl, playerId, campaignId } = getCombatApiEnv()

  const url = new URL("/api/encounter/advance", baseUrl)
  url.searchParams.set("campaignId", campaignId)
  url.searchParams.set("playerId", playerId)

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, playerId }),
      signal,
    })

    if (!res.ok) {
      if (res.status === 400) {
        const errorData = await res.json().catch(() => ({}))
        if (errorData.code === "PLAYER_TURN")
          throw new Error("Сейчас ход игрока, нельзя продвинуть ход.")
      }
      throw new Error("Не удалось продвинуть ход.")
    }

    const data = (await res.json()) as IApiAdvanceResponse

    if (!data.success) {
      if (data.errorCode === "PLAYER_TURN")
        throw new Error("Сейчас ход игрока, нельзя продвинуть ход.")
      throw new Error("Бой завершён.")
    }

    if (!data.encounter || data.encounter.status === "ended")
      throw new Error("Бой завершён.")

    const sortedParticipants = [...data.encounter.participants].sort(
      (a, b) => b.initiative - a.initiative,
    )

    return {
      id: data.encounter.encounterId,
      active: data.encounter.status === "active",
      round: data.encounter.round,
      isPlayerTurn: data.encounter.isPlayerTurn,
      combatants: sortedParticipants.map((p) =>
        mapParticipantToCombatant(p, data.encounter!.currentParticipantId),
      ),
      log: data.encounter.log || [],
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err
    if (err instanceof Error) throw err
    throw new Error("Не удалось продвинуть ход.")
  }
}
