import type { ILocationLink } from "../types"
import { getWorldApiEnv, readApiError } from "./env"

interface IParams {
  signal?: AbortSignal
}

export const getLocationLinks = async ({
  signal,
}: IParams = {}): Promise<ILocationLink[]> => {
  const { baseUrl, campaignId } = getWorldApiEnv()
  const url = new URL("/api/location/links", baseUrl)
  url.searchParams.set("campaignId", campaignId)
  const res = await fetch(url, { signal })
  if (!res.ok)
    throw new Error(await readApiError(res, "Не удалось загрузить дороги."))
  return (await res.json()) as ILocationLink[]
}
