import type {
  IEncounter,
  IApiEncounterResponse,
  IApiParticipant,
  ICombatant,
} from "../types"
import { getCombatApiEnv } from "./env"

interface IGetEncounterParams {
  signal?: AbortSignal
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

export const getEncounter = async ({
  signal,
}: IGetEncounterParams = {}): Promise<IEncounter | null> => {
  const { baseUrl, playerId, campaignId } = getCombatApiEnv()

  const url = new URL("/api/encounter/active", baseUrl)
  url.searchParams.set("campaignId", campaignId)
  url.searchParams.set("playerId", playerId)

  try {
    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error("Не удалось получить данные боя.")

    const data = (await res.json()) as IApiEncounterResponse

    if (!data.hasActiveEncounter || !data.encounter) return null

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
      log: [],
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err
    console.error("Failed to fetch encounter:", err)
    return null
  }
}
