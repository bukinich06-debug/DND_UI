import type { IPlayerLocation } from "../types"
import { getWorldApiEnv, readApiError } from "./env"

interface IParams {
  signal?: AbortSignal
}

export const getPlayerLocation = async ({
  signal,
}: IParams = {}): Promise<IPlayerLocation> => {
  const { baseUrl, playerId } = getWorldApiEnv()
  const url = new URL("/api/location/player", baseUrl)
  url.searchParams.set("playerId", playerId)
  const res = await fetch(url, { signal })
  if (!res.ok)
    throw new Error(
      await readApiError(res, "Не удалось загрузить позицию игрока."),
    )
  return (await res.json()) as IPlayerLocation
}
