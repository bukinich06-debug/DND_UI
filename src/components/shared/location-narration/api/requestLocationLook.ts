import type { IMasterReply } from "../../types"

interface IRequestLocationLookParams {
  signal?: AbortSignal
}

interface ILocationDescribeResponse {
  description: string
  locationId: string
  locationName: string
}

const isLocationDescribeResponse = (
  value: unknown,
): value is ILocationDescribeResponse => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.description === "string" &&
    typeof obj.locationId === "string" &&
    typeof obj.locationName === "string"
  )
}

export const requestLocationLook = async ({
  signal,
}: IRequestLocationLookParams = {}): Promise<IMasterReply> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const campaignId = process.env.NEXT_PUBLIC_COMPANY_ID
  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID

  if (!baseUrl || !campaignId || !playerId)
    throw new Error(
      "Не заданы переменные окружения для запроса описания локации.",
    )

  const url = new URL("/api/location/describe", baseUrl)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId, playerId }),
    signal,
  })

  if (!res.ok)
    throw new Error("Не удалось получить описание локации от мастера.")

  const data: unknown = await res.json()
  if (!isLocationDescribeResponse(data))
    throw new Error("Некорректный ответ при запросе описания локации.")

  return {
    agent: "master",
    verdict: "allowed",
    say: data.description,
    toolCalls: [],
  }
}
