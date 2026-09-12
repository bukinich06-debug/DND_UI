export const getTurnApiEnv = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const campaignId = process.env.NEXT_PUBLIC_COMPANY_ID
  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID
  if (!baseUrl || !campaignId || !playerId)
    throw new Error("Не заданы переменные окружения для хода.")
  return { baseUrl, campaignId, playerId }
}

export const readApiError = async (res: Response, fallback: string) => {
  try {
    const data = (await res.json()) as { error?: string }
    if (data.error) return data.error
  } catch {
    /* ignore */
  }
  return fallback
}
