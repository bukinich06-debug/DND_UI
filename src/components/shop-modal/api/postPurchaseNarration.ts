import type { ITurnReply } from "@/components/shared/types"
import {
  getTurnApiEnv,
  readApiError,
} from "@/components/adventure/composer/api/env"
import type { ITurnResult } from "@/components/adventure/composer/api/postTurn"

interface IPostPurchaseNarrationParams {
  npcId: string
  itemName: string
  quantity: number
  totalPriceCp: number
}

const isTurnResult = (value: unknown): value is ITurnResult => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const obj = value as Record<string, unknown>
  if (obj.status !== "done" && obj.status !== "need_check") return false
  if (!Array.isArray(obj.replies)) return false
  if (obj.status === "done") return true
  return Boolean(obj.check && obj.resume && typeof obj.check === "object")
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
  if (!isTurnResult(data)) return []
  return data.replies
}
