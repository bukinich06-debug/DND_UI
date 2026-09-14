import type { IApiShopData, IShopData } from "../types"
import { formatPrice } from "../helpers/formatPrice"
import { getShopApiEnv } from "./env"

interface IGetShopParams {
  npcId: string
  signal?: AbortSignal
}

export const getShop = async ({
  npcId,
  signal,
}: IGetShopParams): Promise<IShopData> => {
  const { baseUrl, playerId } = getShopApiEnv()

  const url = new URL(`/api/shop/${npcId}`, baseUrl)
  url.searchParams.set("playerId", playerId)

  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error("Не удалось получить товары торговца.")

  const data = (await res.json()) as IApiShopData
  if (!data || typeof data !== "object")
    throw new Error("Некорректный ответ от магазина.")

  return {
    npcId: data.npcId,
    npcName: data.npcName,
    specialtyKey: data.specialtyKey,
    specialtyName: data.specialtyName,
    playerCoinsCp: data.playerCoinsCp,
    items: data.items.map((item) => ({
      ...item,
      priceFormatted: formatPrice(item.priceCp),
    })),
  }
}
