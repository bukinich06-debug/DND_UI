import type { IComposerItem } from "../types"
import { getTurnApiEnv, readApiError } from "./env"

interface IApiItem {
  id: string
  name: string
  kind: string
}

interface IParams {
  signal?: AbortSignal
}

export const getItems = async ({
  signal,
}: IParams = {}): Promise<IComposerItem[]> => {
  const { baseUrl, playerId } = getTurnApiEnv()
  const url = new URL("/api/items", baseUrl)
  url.searchParams.set("playerId", playerId)
  const res = await fetch(url, { signal })
  if (!res.ok)
    throw new Error(await readApiError(res, "Не удалось получить предметы."))
  const data = (await res.json()) as IApiItem[]
  if (!Array.isArray(data))
    throw new Error("Некорректный ответ списка предметов.")
  return data.map((item) => ({ id: item.id, name: item.name, kind: item.kind }))
}
