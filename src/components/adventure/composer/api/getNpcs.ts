import type { IComposerNpc } from "../types"
import { getTurnApiEnv, readApiError } from "./env"

interface INpcRow {
  npc: { id: string name: string }
}

interface IParams {
  signal?: AbortSignal
}

export const getNpcs = async ({
  signal,
}: IParams = {}): Promise<IComposerNpc[]> => {
  const { baseUrl, playerId } = getTurnApiEnv()
  const url = new URL("/api/location/player/npcs", baseUrl)
  url.searchParams.set("playerId", playerId)
  const res = await fetch(url, { signal })
  if (!res.ok)
    throw new Error(await readApiError(res, "Не удалось получить NPC рядом."))
  const data = (await res.json()) as INpcRow[]
  if (!Array.isArray(data)) throw new Error("Некорректный ответ списка NPC.")
  return data.map((row) => ({ id: row.npc.id, name: row.npc.name }))
}
