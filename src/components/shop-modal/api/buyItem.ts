import { getShopApiEnv, readApiError } from "./env"

interface IBuyItemParams {
  npcId: string
  itemId: string
  quantity: number
}

export const buyItem = async ({
  npcId,
  itemId,
  quantity,
}: IBuyItemParams): Promise<void> => {
  const { baseUrl, playerId } = getShopApiEnv()

  const url = new URL(`/api/shop/${npcId}/buy`, baseUrl)

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      playerId,
      itemId,
      quantity,
    }),
  })

  if (!res.ok)
    throw new Error(
      await readApiError(res, "Не удалось купить предмет."),
    )
}
