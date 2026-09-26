import type {
  IEncounter,
  IApiParticipant,
  ICombatant,
  ICombatLogEntry,
} from "../types"
import { getCombatApiEnv } from "./env"

interface IEndPlayerTurnParams {
  signal?: AbortSignal
}

interface IApiEndTurnResponse {
  success: boolean
  error?: string
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
  encounterEnded?: boolean
  encounterResult?: {
    victory: boolean
    defeated: string[]
    survivors: string[]
    defeatedMonsters: Array<{ name: string; catalogKey: string }>
  }
}

export interface IEndPlayerTurnResult {
  encounter: IEncounter | null
  encounterEnded?: boolean
  encounterResult?: {
    victory: boolean
    defeated: string[]
    survivors: string[]
    defeatedMonsters: Array<{ name: string; catalogKey: string }>
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

export const endPlayerTurn = async ({
  signal,
}: IEndPlayerTurnParams = {}): Promise<IEndPlayerTurnResult> => {
  const { baseUrl, playerId, campaignId } = getCombatApiEnv()

  const url = new URL("/api/encounter/end-turn", baseUrl)

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId, playerId }),
    signal,
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Не удалось завершить ход.")
  }

  const data = (await res.json()) as IApiEndTurnResponse

  if (!data.success || !data.encounter) {
    throw new Error(data.error || "Не удалось завершить ход.")
  }

  if (data.encounter.status === "ended") {
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
      encounterEnded: data.encounterEnded,
      encounterResult: data.encounterResult,
    }
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
    encounterEnded: data.encounterEnded,
    encounterResult: data.encounterResult,
  }
}
