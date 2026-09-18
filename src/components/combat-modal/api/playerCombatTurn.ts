import type {
  IEncounter,
  IApiParticipant,
  ICombatant,
  ICombatLogEntry,
} from "../types"
import { getCombatApiEnv } from "./env"

interface IPlayerCombatTurnParams {
  encounterId: string
  playerAction: string
  signal?: AbortSignal
}

interface IApiPlayerTurnResponse {
  success?: boolean
  say?: string
  do?: string
  toolCalls?: unknown[]
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

export const playerCombatTurn = async ({
  encounterId,
  playerAction,
  signal,
}: IPlayerCombatTurnParams): Promise<IEncounter> => {
  const { baseUrl, playerId, campaignId } = getCombatApiEnv()

  const url = new URL("/api/encounter/player-turn", baseUrl)

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId,
        encounterId,
        playerId,
        playerAction,
      }),
      signal,
    })

    if (!res.ok) throw new Error("Не удалось выполнить ход игрока.")

    const data = (await res.json()) as IApiPlayerTurnResponse

    if (!data.encounter) {
      throw new Error("Не получен обновлённый бой в ответе.")
    }

    if (data.encounter.status === "ended")
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
    throw new Error("Не удалось выполнить ход игрока.")
  }
}
