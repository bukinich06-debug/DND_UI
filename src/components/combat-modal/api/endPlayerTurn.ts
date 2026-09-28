import type {
  IEncounter,
  IApiParticipant,
  ICombatant,
  ICombatLogEntry,
  ICombatOutcome,
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
    outcome?: "victory" | "captured" | "defeat" | "fled"
    defeated: string[]
    survivors: string[]
    defeatedMonsters: Array<{ name: string; catalogKey: string }>
    capturedBy?: string[]
  }
}

export interface IEndPlayerTurnResult {
  encounter: IEncounter | null
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
  positionFeet: participant.positionFeet,
  initiative: participant.initiative,
  order: participant.order ?? participant.initiative,
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

  if (!data.success) {
    throw new Error(data.error || "Не удалось завершить ход.")
  }

  if (data.encounterEnded || !data.encounter || data.encounter.status === "ended") {
    if (data.encounterEnded && data.encounterResult) {
      return {
        encounter: data.encounter
          ? {
              id: data.encounter.encounterId,
              active: false,
              round: data.encounter.round,
              isPlayerTurn: data.encounter.isPlayerTurn,
              combatants: [...data.encounter.participants]
                .sort((a, b) => (a.order ?? a.initiative) - (b.order ?? b.initiative))
                .map((p) =>
                  mapParticipantToCombatant(
                    p,
                    data.encounter!.currentParticipantId,
                  ),
                ),
              log: data.encounter.log || [],
            }
          : null,
        encounterEnded: true,
        encounterResult: {
          victory: data.encounterResult.victory,
          outcome: data.encounterResult.outcome,
          defeated: data.encounterResult.defeated,
          survivors: data.encounterResult.survivors,
          defeatedMonsters: data.encounterResult.defeatedMonsters,
          capturedBy: data.encounterResult.capturedBy,
        },
      }
    }
    throw new Error(data.error || "Не удалось завершить ход.")
  }

  const sortedParticipants = [...data.encounter.participants].sort(
    (a, b) => (a.order ?? a.initiative) - (b.order ?? b.initiative),
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
    encounterResult: data.encounterResult
      ? {
          victory: data.encounterResult.victory,
          outcome: data.encounterResult.outcome,
          defeated: data.encounterResult.defeated,
          survivors: data.encounterResult.survivors,
          defeatedMonsters: data.encounterResult.defeatedMonsters,
          capturedBy: data.encounterResult.capturedBy,
        }
      : undefined,
  }
}
