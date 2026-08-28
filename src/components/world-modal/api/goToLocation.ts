import type { IPlayerLocation } from "../types"
import { getWorldApiEnv, readApiError } from "./env"

export const goToLocation = async (
  locationId: string,
): Promise<IPlayerLocation> => {
  const { baseUrl, playerId } = getWorldApiEnv()
  const url = new URL("/api/location/player", baseUrl)
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId, locationId }),
  })
  if (!res.ok)
    throw new Error(await readApiError(res, "Не удалось перейти в локацию."))
  return (await res.json()) as IPlayerLocation
}
