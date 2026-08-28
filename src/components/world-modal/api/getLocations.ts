import type { ILocation } from "../types"
import { getWorldApiEnv, readApiError } from "./env"

interface IParams {
  signal?: AbortSignal
}

export const getLocations = async ({
  signal,
}: IParams = {}): Promise<ILocation[]> => {
  const { baseUrl, campaignId } = getWorldApiEnv()
  const url = new URL("/api/location", baseUrl)
  url.searchParams.set("campaignId", campaignId)
  const res = await fetch(url, { signal })
  if (!res.ok)
    throw new Error(await readApiError(res, "Не удалось загрузить локации."))
  return (await res.json()) as ILocation[]
}
