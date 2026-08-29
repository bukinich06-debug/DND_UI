export const getItemsApiEnv = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const playerId = process.env.NEXT_PUBLIC_PLAYER_ID;
  if (!baseUrl || !playerId) throw new Error("Не заданы переменные окружения для запроса предметов.");
  return { baseUrl, playerId };
};

export const readApiError = async (res: Response, fallback: string) => {
  try {
    const data = (await res.json()) as { error?: string };
    if (data.error) return data.error;
  } catch {
    /* ignore */
  }
  return fallback;
};
