import type { ITurnReply } from "@/components/shared/types"
import { getTurnApiEnv } from "@/components/adventure/composer/api/env"

interface IPostPurchaseNarrationParams {
  npcId: string
  itemName: string
  quantity: number
  totalPriceCp: number
}

interface IPurchaseNarrationResult {
  status: "done" | "need_check"
  replies: ITurnReply[]
}

const isPurchaseNarrationResult = (
  value: unknown,
): value is IPurchaseNarrationResult => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const obj = value as Record<string, unknown>
  if (obj.status !== "done" && obj.status !== "need_check") return false
  return Array.isArray(obj.replies)
}

export const postPurchaseNarration = async ({
  npcId,
  itemName,
  quantity,
  totalPriceCp,
}: IPostPurchaseNarrationParams): Promise<ITurnReply[]> => {
  const { baseUrl, campaignId, playerId } = getTurnApiEnv()
  const url = new URL("/api/turn", baseUrl)

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaignId,
      playerId,
      messages: [],
      postPurchase: {
        npcId,
        itemName,
        quantity,
        totalPriceCp,
      },
    }),
  })

  if (!res.ok) return []

  const data: unknown = await res.json()
  if (!isPurchaseNarrationResult(data)) return []
  return data.replies
}
