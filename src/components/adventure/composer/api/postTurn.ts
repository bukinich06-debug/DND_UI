import type { ITurnReply, IOpenShopSignal } from "@/components/shared/types"
import { getTurnApiEnv, readApiError } from "./env"

export interface IChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface IResolvedCheck {
  skill: string
  skillLabel: string
  dc: number
  bonus: number
  die: "d20"
  knowledgeId: string | null
}

export type ITurnResume =
  | {
      agent: "npc"
      npcId: string
      remainingSteps: unknown[]
    }
  | { agent: "master"; remainingSteps: unknown[] }

export type ITurnResult =
  | {
      status: "need_check"
      replies: ITurnReply[]
      check: IResolvedCheck
      resume: ITurnResume
      ui?: { openShop?: IOpenShopSignal }
    }
  | { status: "done"; replies: ITurnReply[]; ui?: { openShop?: IOpenShopSignal } }

interface IPostTurnParams {
  messages: IChatMessage[]
  resume?: ITurnResume
  check?: { skill: string; dc: number; knowledgeId?: string | null }
  rollId?: string
}

const isTurnResult = (value: unknown): value is ITurnResult => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const obj = value as Record<string, unknown>
  if (obj.status !== "done" && obj.status !== "need_check") return false
  if (!Array.isArray(obj.replies)) return false
  if (obj.status === "done") return true
  return Boolean(obj.check && obj.resume && typeof obj.check === "object")
}

export const postTurn = async ({
  messages,
  resume,
  check,
  rollId,
}: IPostTurnParams): Promise<ITurnResult> => {
  const { baseUrl, campaignId, playerId } = getTurnApiEnv()
  const url = new URL("/api/turn", baseUrl)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      campaignId,
      playerId,
      messages,
      resume,
      check,
      rollId,
    }),
  })
  if (!res.ok)
    throw new Error(await readApiError(res, "Не удалось выполнить ход."))
  const data: unknown = await res.json()
  if (!isTurnResult(data)) throw new Error("Некорректный ответ хода.")
  return data
}
