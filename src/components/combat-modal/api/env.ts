export const getCombatApiEnv = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID
  const campaignId = process.env.NEXT_PUBLIC_COMPANY_ID
  if (!baseUrl || !playerId || !campaignId)
    throw new Error("Не заданы переменные окружения для боевого режима.")
  return { baseUrl, playerId, campaignId }
}
