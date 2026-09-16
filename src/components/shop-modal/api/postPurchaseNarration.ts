import type { ITurnReply } from "@/components/shared/types"
import { getTurnApiEnv } from "@/components/adventure/composer/api/env"

interface IPostPurchaseNarrationParams {
  npcId: string
  itemName: string
  itemId: string
  catalogKey: string
  quantity: number
  priceCp: number
}

interface IPurchaseNarrationResult {
  replies: ITurnReply[]
}

const isPurchaseNarrationResult = (
  value: unknown,
): value is IPurchaseNarrationResult => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const obj = value as Record<string, unknown>
  return Array.isArray(obj.replies)
}

export const postPurchaseNarration = async ({
  npcId,
  itemName,
  itemId,
  catalogKey,
  quantity,
  priceCp,
}: IPostPurchaseNarrationParams): Promise<ITurnReply[]> => {
  const { baseUrl, campaignId, playerId } = getTurnApiEnv()
  const url = new URL("/api/turn", baseUrl)

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaignId,
      playerId,
      purchase: {
        npcId,
        itemName,
        itemId,
        catalogKey,
        quantity,
        priceCp,
        settled: true,
      },
    }),
  })

  if (!res.ok) return []

  const data: unknown = await res.json()
  if (!isPurchaseNarrationResult(data)) return []
  return data.replies
}
