import type {
  IEncounter,
  IApiParticipant,
  ICombatant,
  ICombatLogEntry,
  ICombatOutcome,
} from "../types"
import { getCombatApiEnv } from "./env"

interface IPlayerCombatTurnParams {
  encounterId: string
  playerAction: string
  signal?: AbortSignal
}

export interface IPlayerCombatTurnResult {
  encounter: IEncounter
  say?: string
  error?: string
  encounterEnded?: boolean
  encounterResult?: ICombatOutcome
}

interface IApiPlayerTurnResponse {
  success?: boolean
  say?: string
  error?: string
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
  encounterEnded?: boolean
  encounterResult?: ICombatOutcome
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
  actionUsed: participant.actionUsed ?? false,
  bonusActionUsed: participant.bonusActionUsed ?? false,
  reactionUsed: participant.reactionUsed ?? false,
  movementUsedFeet: participant.movementUsedFeet ?? 0,
  speed: participant.speed ?? 30,
  playerId: participant.playerId,
  deathSaveSuccess: participant.deathSaveSuccess,
  deathSaveFail: participant.deathSaveFail,
  isStable: participant.isStable,
  dead: participant.dead,
  conditions: participant.conditions,
})

export const playerCombatTurn = async ({
  encounterId,
  playerAction,
  signal,
}: IPlayerCombatTurnParams): Promise<IPlayerCombatTurnResult> => {
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

    const data = (await res.json()) as IApiPlayerTurnResponse

    if (!res.ok) {
      throw new Error(data.error || "Не удалось выполнить ход игрока.")
    }

    if (data.encounterEnded || !data.encounter || data.encounter?.status === "ended") {
      if (data.encounterEnded && data.encounterResult && data.encounter) {
        const sortedParticipants = [...data.encounter.participants].sort(
          (a, b) => b.initiative - a.initiative,
        )

        return {
          encounter: {
            id: data.encounter.encounterId,
            active: false,
            round: data.encounter.round,
            isPlayerTurn: data.encounter.isPlayerTurn,
            combatants: sortedParticipants.map((p) =>
              mapParticipantToCombatant(p, data.encounter!.currentParticipantId),
            ),
            log: data.encounter.log || [],
          },
          say: data.say,
          encounterEnded: true,
          encounterResult: data.encounterResult,
        }
      }
      throw new Error("Не получен обновлённый бой в ответе.")
    }

    const sortedParticipants = [...data.encounter.participants].sort(
      (a, b) => b.initiative - a.initiative,
    )

    return {
      encounter: {
        id: data.encounter.encounterId,
        active: data.encounter.status === "active",
        round: data.encounter.round,
        isPlayerTurn: data.encounter.isPlayerTurn,
        combatants: sortedParticipants.map((p) =>
          mapParticipantToCombatant(p, data.encounter!.currentParticipantId),
        ),
        log: data.encounter.log || [],
      },
      say: data.say,
      encounterEnded: data.encounterEnded,
      encounterResult: data.encounterResult,
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err
    if (err instanceof Error) throw err
    throw new Error("Не удалось выполнить ход игрока.")
  }
}
