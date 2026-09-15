import type { IToolCallLog, MasterVerdict } from "@/components/shared/types"
import { getTurnApiEnv, readApiError } from "./env"
import type { IChatMessage } from "./postTurn"

interface IMasterAdjudicateResponse {
  verdict: MasterVerdict
  say: string
  check?: {
    skill: string
    dc: number
    knowledgeId: string | null
  }
  toolCalls?: IToolCallLog[]
}

const isMasterAdjudicateResponse = (
  value: unknown,
): value is IMasterAdjudicateResponse => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.verdict === "string" &&
    typeof obj.say === "string" &&
    (!obj.toolCalls || Array.isArray(obj.toolCalls))
  )
}

interface IPostMasterParams {
  messages: IChatMessage[]
  signal?: AbortSignal
}

export const postMaster = async ({
  messages,
  signal,
}: IPostMasterParams): Promise<IMasterAdjudicateResponse> => {
  const { baseUrl, campaignId, playerId } = getTurnApiEnv()
  const url = new URL("/api/master", baseUrl)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId, playerId, messages }),
    signal,
  })
  if (!res.ok)
    throw new Error(
      await readApiError(res, "Не удалось получить ответ мастера."),
    )
  const data: unknown = await res.json()
  if (!isMasterAdjudicateResponse(data))
    throw new Error("Некорректный ответ мастера.")
  return data
}
