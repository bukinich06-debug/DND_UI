import type { ITurnReply } from "../../types"

interface IRequestLocationLookParams {
  signal?: AbortSignal
}

interface ILocationLookResult {
  replies: ITurnReply[]
}

const isLocationLookResult = (value: unknown): value is ILocationLookResult => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const obj = value as Record<string, unknown>
  return Array.isArray(obj.replies)
}

export const requestLocationLook = async ({
  signal,
}: IRequestLocationLookParams = {}): Promise<ITurnReply[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const campaignId = process.env.NEXT_PUBLIC_COMPANY_ID
  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID

  if (!baseUrl || !campaignId || !playerId)
    throw new Error(
      "Не заданы переменные окружения для запроса описания локации.",
    )

  const url = new URL("/api/turn/look", baseUrl)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId, playerId }),
    signal,
  })

  if (!res.ok)
    throw new Error("Не удалось получить описание локации от мастера.")

  const data: unknown = await res.json()
  if (!isLocationLookResult(data))
    throw new Error("Некорректный ответ при запросе описания локации.")

  return data.replies
}
