import type {
  IEncounter,
  IApiParticipant,
  ICombatant,
  ICombatLogEntry,
  ICombatOutcome,
} from "../types"
import { getCombatApiEnv } from "./env"

interface IAdvanceEncounterParams {
  signal?: AbortSignal
}

interface IApiAdvanceResponse {
  success: boolean
  error?: string
  errorCode?: string
  encounter: {
    encounterId: string
    round: number
    currentTurnIndex: number
    status: string
    currentParticipantId: string
    isPlayerTurn: boolean
    participants: IApiParticipant[]
    log?: ICombatLogEntry[]
  } | null
  newLogEntries?: ICombatLogEntry[]
  encounterEnded?: boolean
  encounterResult?: {
    victory: boolean
    outcome?: "victory" | "captured" | "defeat"
    defeated: string[]
    survivors: string[]
    defeatedMonsters: Array<{ name: string; catalogKey: string }>
    capturedBy?: string[]
  }
}

interface IAdvanceEncounterResult {
  encounter: IEncounter | null
  encounterEnded: boolean
  encounterResult: ICombatOutcome | null
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

export const advanceEncounter = async ({
  signal,
}: IAdvanceEncounterParams = {}): Promise<IAdvanceEncounterResult> => {
  const { baseUrl, playerId, campaignId } = getCombatApiEnv()

  const url = new URL("/api/encounter/advance", baseUrl)

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId, playerId }),
    signal,
  })

  if (!res.ok) {
    if (res.status === 400) {
      const errorData = await res.json().catch(() => ({}))
      if (errorData.errorCode === "PLAYER_TURN")
        throw new Error("Сейчас ход игрока, нельзя продвинуть ход.")
    }
    throw new Error("Не удалось продвинуть ход.")
  }

  const data = (await res.json()) as IApiAdvanceResponse

  if (!data.success || !data.encounter) {
    throw new Error(data.error || "Не удалось продвинуть ход.")
  }

  if (data.encounter.status === "ended" || data.encounterEnded) {
    return {
      encounter: null,
      encounterEnded: true,
      encounterResult: data.encounterResult
        ? {
            victory: data.encounterResult.victory,
            outcome: data.encounterResult.outcome,
            defeated: data.encounterResult.defeated,
            survivors: data.encounterResult.survivors,
            defeatedMonsters: data.encounterResult.defeatedMonsters,
            capturedBy: data.encounterResult.capturedBy,
          }
        : null,
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
    encounterEnded: false,
    encounterResult: null,
  }
}
