import { getTurnApiEnv, readApiError } from "./env"

interface IDiceRoll {
  id: string
  value: number
}

export const postDiceRoll = async (skill: string): Promise<IDiceRoll> => {
  const { baseUrl, campaignId, playerId } = getTurnApiEnv()
  const url = new URL("/api/dice-rolls", baseUrl)
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ campaignId, playerId, die: "d20", note: skill }),
  })
  if (!res.ok)
    throw new Error(await readApiError(res, "Не удалось бросить кубик."))
  const data = (await res.json()) as Partial<IDiceRoll>
  if (typeof data.id !== "string" || typeof data.value !== "number")
    throw new Error("Некорректный ответ броска.")
  return { id: data.id, value: data.value }
}
