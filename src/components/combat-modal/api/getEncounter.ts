import type { IEncounter } from "../types"
import { getCombatApiEnv } from "./env"

interface IGetEncounterParams {
  signal?: AbortSignal
}

export const getEncounter = async ({
  signal,
}: IGetEncounterParams = {}): Promise<IEncounter | null> => {
  const { baseUrl, playerId } = getCombatApiEnv()

  const url = new URL("/api/encounter", baseUrl)
  url.searchParams.set("playerId", playerId)

  try {
    const res = await fetch(url, { signal })
    if (res.status === 404) return null
    if (!res.ok) throw new Error("Не удалось получить данные боя.")

    const data = (await res.json()) as IEncounter
    if (!data || typeof data !== "object")
      throw new Error("Некорректный ответ данных боя.")

    return data
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err
    console.error("Failed to fetch encounter:", err)
    return null
  }
}
