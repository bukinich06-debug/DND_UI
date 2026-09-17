export const getCombatApiEnv = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID
  if (!baseUrl || !playerId)
    throw new Error("Не заданы переменные окружения для боевого режима.")
  return { baseUrl, playerId }
}
